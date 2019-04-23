Checklist for Deployment:
1. [ ] [Verify all Automated Tests pass](https://github.com/internetarchive/openlibrary/wiki/Testing)
2. [ ] [Test & QA changes on Staging](#testing-on-staging)
3. [ ] [Handle dependency changes](#satisfying-dependency-changes)
4. [ ] [Deploy to Production](#deploying-to-production)
    - [ ] [Deploy OpenLibrary & Olsystem](#deploying-openlibrary)
    - [ ] [Test the Deployment](#testing-deployment)
    - [ ] [Restart OpenLibrary Service](#restarting-services)
5. [ ] [Monitor Deployment](#monitoring-deployment)
6. [ ] [Troubleshoot a Failed Deployment](#recovering-from-a-failed-deployment)
    - [ ] [Rolling Back](#rolling-back)
7. [ ] [Git Tag Successful Release](#git-tagging-a-release)

# Introduction

Greetings deployer! You are one of the select few who has privileged access to Internet Archive infrastructure and is tasked with the important responsibility of deploying the Open Library website. Deploys typically occur on Thursday, after the candidate code has had a few days to be tested on staging (https://dev.openlibrary.org). The following are instructions which we hope will ease you in your journey towards a successful deploy of the Open Library system. For more information on the system architecture, please refer to the [Production Provisioning Guide](https://github.com/internetarchive/openlibrary/wiki/Production-Service-Architecture) 

# Testing on Staging

Before code is pushed to production, it pass all tests -- see [Testing Guide](https://github.com/internetarchive/openlibrary/wiki/Testing) -- and should be QA tested on development, i.e. ol-dev0 (https://dev.openlibrary.org). If packages are missing, make sure you track them in your `requirements.txt` and `scripts/bootstrap.sh` as these will have to be [manually installed on production](#Satisfying_Dependency_Changes).

```
ssh -A ol-dev0
cd /opt/openlibrary/openlibrary  # where OL code lives
git checkout <branch>  # checkout the correct branch name

# Rebuild CSS, JS dependencies
sudo make css; sudo make js

# Restart the dev server
sudo kill -9 `pgrep -f openlibrary-server`  # kill previous instance
sudo /olsystem/bin/upstart-service openlibrary-server :7071 &  # restart 
```

# Satisfying Dependency Changes

As unideal as it my be, the deployment process is not yet fully configured to understand and be responsive to changes in your Python requirements.txt / library or your `apt-get` ubuntu dependencies. As a result, you'll need to manually make sure `ol-home`, `ol-web3`, `ol-web4`, and `ol-www1` have the correct dependencies using `pip` and `apt-get`:

```
ssh ol-web3 # needed for openlibrary restart
cd /opt/openlibrary
sudo su openlibrary
source venv/bin/activate
pip install <requirement(s)>

ssh ol-web4 # needed for openlibrary restart
sudo su openlibrary
cd /opt/openlibrary
source venv/bin/activate
pip install <requirement(s)>

ssh ol-home # needed for solr-updater restart
sudo su openlibrary
cd /opt/openlibrary
source venv/bin/activate
pip install <requirement(s)>

ssh ol-www1  # required for serving static files
sudo su openlibrary
cd /opt/openlibrary
source venv/bin/activate
pip install <requirement(s)>
```

After dependencies are installed, restart solr-updater, openlibrary and make sure nagios shows no alerts.

# Deploying to Production

## Strategy

On production, Open Library practices [blue-green](http://blog.christianposta.com/deploy/blue-green-deployments-a-b-testing-and-canary-releases/) deployment. The purpose of a blue-green deploy is to gracefully deploy without downtime. Blue-green deployment is a 2-stage strategy whereby deployment is performed on a non-active secondary node (blue) without any changes being made to the primary (green) active node. Once it has been ensured that deployment of the blue node has completed successfully, a command is issued to switch the roles of the blue and green node (the newly deployed blue node becomes the green node). The previous green node may then be used as a secondary green node within a load-blanced pool until it is needed again as a blue node (as is the case with our setup). Open Library has two web nodes (`ol-web3` and `ol-web4`) which are load balanced using `haproxy` behind `nginx` (`ol-www1`).

For Open Library, we have a haproxy load-balancer (`ol-www1`) which coordinates several services, including 2 instances of the openlibrary website (`ol-web3` and `ol-web4`) which it distributes balanced workloads to. During our blue-green deploy, we deploy to both `ol-web3` and `ol-web4` but we only restart `ol-web3` (our blue node) while `ol-web4` (green) continues to serve clients using the stable code. This way, if there is a problem with deployment, 

Caution: Because one of our two web servers (namely `ol-web3`, our blue node) is effectively being recommissioned as a staging server during deployment, additional stress will be applied to `ol-web4` in the event where `ol-web3` experiences a failure and goes offline. Therefore, it is not advised to deploy during times of high user traffic.

## Deploying OpenLibrary

On ol-home (make sure you ssh with -A to forwards ssh keys, required if you don't want "permission denied for pubkey" errors or restart) issue the following commands to initiate a deployment to all production nodes:

```
ssh -A ol-home
/olsystem/bin/deploy-code openlibrary
```

If you've made a change to your configuration in `olsystem` (i.e. /opt/openlibrary/olsystem) then from `ol-home` you will also run:

```
/olsystem/bin/deploy-code olsystem
```

## Testing Deployment

`ssh` into the public facing web-head (i.e. `ol-www1`), activate the VM's virtualenv, and try importing the openlibrary package directly from python and start the service on a different port for testing:

```
source /opt/openlibrary/venv/bin/activate
python import openlibrary  # detect any obvious breaking problems

# Run OL (in stand-alone debug mode) on a different port
sudo /olsystem/bin/upstart-service openlibrary-server :1234
# Ctrl+c to kill this process or...
sudo kill -9 `pgrep -f openlibrary-server`  # kill previous instance 
```

## Restarting Services

From `ol-home`, once the deployment(s) are complete and you've [tested deployment](#Testing_Deployment), you are ready to restart the production web-nodes `ol-web3` and `ol-web4` in blue-green fashion. Consult [Monitoring Deployment](#Monitoring_Deployment) after **each** web-node is restarted:

```
ssh ol-web3 sudo supervisorctl restart openlibrary  # blue node;
```

Before proceeding, [check haproxy loadbalancer](https://openlibrary.org/admin?stats) to ensure the blue node succeeds before attempting to restart the green node.

```
ssh ol-web4 sudo supervisorctl restart openlibrary  # green node;
```

# Monitoring Deployment

After deploying Open Library, verify all systems are green via the following procedures:

- Check HAProxy to ensure both `ol-web3` and `ol-web4` are up (as is `ol-www1`)
- Check for [red flags in nagios](https://monitor.archive.org/cgi-bin/nagios3/status.cgi?hostgroup=24.openlibrary&style=detail&limit=0&start=100&limit=100)

# Recovering from a Failed Deployment

## Rolling Back

The base directories of all previous deploys are stored by Git commit hash in `/opt/openlibrary/deploys` with the currently deployed code symlinked from `/opt/openlibrary/openlibrary`.

To roll back, go to the particular server(s), e.g. ol-web3 and ol-web4, reset the `/opt/openlibrary/openlibrary` symlink to point to the desired earlier directory in `/opt/openlibrary/deploys` and then restart openlibrary.

The same procedure applies to olsystem (although olsystem doesn't need to be restart; however, openlibrary may need a restart after deploying olsystem).

# Git Tagging a Release

After you have deployed to ol-home (production Open Library), tag the master branch accordingly:

Check that you're on master...

```
> git branch
* master
```

Fill in the years, months, days where appropriate...

```
> git tag deploy-yyyy-mm-dd
> git push origin deploy-yyyy-mm-dd
```

# Overloaded Search

https://docs.google.com/document/d/1toBEk01cJ0uUyfOFIxrASlFzX9aPIML3vdj4WAXrxyY/edit#

On 2019-03-28 (and the week thereof) Open Library was experiencing unresponsive web heads (ol-web3, ol-web4) via haproxy. The reason for the outage was that recent changes have been made with Archive.org Elastic Search so that clients who make many concurrent requests get demoted and queued, so that these requests do not take priority over users making individual requests. It's hypothesized that Open Library (as a whole) is somehow being treated as a single client (instead of Open Library's clients being passed through and treated as individual end-users) and presumably this is resulting in Open Library being penalized for its high volume of searches. The end result is ol-web3 and ol-web4 search requests queue are being queued to the point of the Open Library service becoming unresponsive.

Sam was able to discover the issue by attaching `strace` to a single thread of `ol-home` and notice the process was hanging on search dispatch to Archive.org Elastic Search. The solution required unblocking Elastic Search on Archive.org's side.

## Postmortem Diagnostic Guide
On the ol-web3, debug went like:
```
# Update `/olsystem/bin/upstart-service` so “function openlibrary-server” has NUM_WORKERS=1 
$ sudo supervisorctl stop openlibrary  # stop gunicorn
$ sudo netstat -ntlp  # verify nothing listening on 7071 (otherwise kill listening pid)
$ sudo supervisorctl start openlibrary  # start gunicorn in single thread mode
$ sudo strace -tt -s 500 -p $pid_of_gunicorn
# Use curl to see what's happening and then audit the strace
# revert/checkout `/olsystem/bin/upstart-service` back to normal when finished
```

# History
Outage scenarios in descending order of occurrence:
   * 2019-03-29 5:00pm PST OL requests for archive.org ES getting queued until stopped
      * https://github.com/internetarchive/olsystem/wiki/Disaster-Recovery#overloaded-search
   * 2017-11-09 10:00pm PST
      * Situation: `ol-www1` was getting clobbered shortly after syncing it in prep for migration from Funston to Richmond (but this was a red herring). Spikes of traffic were forcing haproxy to 503 w/ haproxy status sQ
      * Tried:
         * Restarting nginx
         * Restarting haproxy (helped for a short period)
         * Updated haproxy.conf to only log errors (this was helpful; helped us identify slow API calls)
         * Updated haproxy.conf to increase process count for `ol-web3`, `ol-web4` (endpoints quickly became saturated again)
      * Resolution:
         * Identify 503 sQ using tail -f /var/log/haproxy.log on ol-www1
         * Run: `sudo tail -n 5000 /var/log/nginx/access.log | cut -d ' ' -f 1 | sort | uniq -c | sort -n | tail -n 10 | /home/samuel/work/reveal-abuse/reveal | /home/samuel/work/reveal-abuse/shownames`
            * See also: https://git.archive.org/mek/detect-abuse
         * Blocking bad actors on `ol-www1` `nginx` in `/olsystem/etc/nginx/deny.conf`
         * Moving forward @jonah will help us implement haproxy sticktables to ban IPs for periods as use becomes abusive/disruptive
   * 2017-03-17 2:30pm PDT
      * Situation: Packet-flapping on the baremetal (running nearly all of OL's services) took down Open Library services -- see: https://internetarchive.slack.com/archives/C06RP0F6E/p1492465473543927
      * Resolution: jonah reset ports switch side, host came back
   * 2017-04-01 2:00pm PDT
      * Situation: ACS4 went down, Nagios alerts triggered, Open Library borrowing failed
      * Resolution:
         * Brenton restarted ACS4 via Ganeti (mek didn't have access)
            * It took ~10 minutes for nagios to catch up on alerts
         * Mek restarted `ol-web3` and `ol-web4` (as otherwise loans were failing)
         * Outage recovery was added to status.archivelab.org
      * Learnings:
         * We need a better guide for ACS outages:
            * http://dev.blog.archive.org/2015/01/20/recovering-from-an-acs4-related-ol-outage/
            * https://wiki.archive.org/twiki/bin/view/BookServer/WebHome
         * More people need access to `ganeti` and `ol-acs4`
      * Resolution(s):
         * Mek now has access to ACS + ganeti
   * 2017-02-22 5:00am PST, 9:45am - 11:00am PST
      * Situation: Cover service was down
      * Tried:
         * Restarting cover store
         * Restarting just `ol-web3` (a la blue green deploy) via supervisord
         * Looked at logs, noticed problem starting gunicorn on `ol-web3`
      * Resolution: https://internetarchive.slack.com/archives/openlibrary/p1487790396002096
      * Thanks: Sam
   * 2017-02-13 6:00pm PST - 6:30pm PST
      * Situation: Scheduled Maintenance w/ Trevor
      * Problems: Servers which were restarted came back up w/ permission problems (/var/run/openlibrary missing)
      * Resolution:
         * [we added server restart guide to deployment](Deployment#handling-server-reboot)
         * [we added docs for checking other services (e.g. solr-updater) which may go down](Deployment#verify-deployment)
      * Questions:
         * Why is this happening? Is some startup process nuking /var/run/openlibrary? https://internetarchive.slack.com/archives/openlibrary/p1487113203001313
      * Thanks: Brenton
   * 2017-02-10 ~5:00pm PST - 5:30pm PST
      * Situation: Deploying IA/OL XAuth bridge, deployment restart failed (`ol-web3`, `ol-web4`)
      * Thanks: Sam, Mark, Jim, Brenton
      * Problem: Deployment process was not robust against new pip dependencies (in this case LEPL for email validation)
      * Learnings:
         * Changing symlinks must be done on all services (`ol-web3`, `ol-web4`, etc)
         * Do not reset history in git as our deploy process looks only at the most recent hash it knows about!
      * Resolution: we added blue-green deployment to our docs + [guide on adding dependencies](Deployment#satisfying-dependency-changes)
   * 2016-12-23 11:50pm PST - 2016-12-24 6:30am PST
      * Situation: DNS problems [reported here](https://internetarchive.slack.com/archives/openlibrary/p1482593478000364), [debugged here](https://internetarchive.slack.com/archives/ops/p1482564582000350) and
      * Resolution: [solved here](https://internetarchive.slack.com/archives/openlibrary/p1482593478000364) -- we started documenting our deployment process
   * 2016-12-22 12:30pm PST - 2016-12-22 13:20pm PST
      * Situation: DNS problem, resolved itself, [recounted here](https://internetarchive.slack.com/archives/ops/p1482440491000312)
   * 2016-12-02 6:35pm PST - 2016-04-02 7:20pm PST
      * Situation: DNS problems, resolved itself, [recounted here](https://internetarchive.slack.com/archives/ops/p1480732524002014)
