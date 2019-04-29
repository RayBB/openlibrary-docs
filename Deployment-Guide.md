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

8. [ ] Optional / as required [Service / Config upgrade testing (Memchache)](#service-config-upgrade-testing-memchache)

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

# Service / Config upgrade testing (Memchache)

See https://github.com/internetarchive/openlibrary/issues/2036

Updating configuration and services has happened a lot less frequently than basic code deployments. The following instructions apply to the less frequent updates that may coincide with code releases. Extra caution is required when updating production configuration and servers since there is not yet a reliable, repeatable process for performing these tasks. They are currently manual steps. We will work on automating these initial deploys with tools like Ansible and Docker where appropriate.

Required OS upgrades (upgrading all our server from Ubuntu Trusty to Ubuntu Xenial, which are required by the end of 2019), will be performed at some point in 2019 for all OL servers and services. We have decided to start with Memcached since it is theoretically the simplest to upgrade, and there is a pool of multiple servers that can have one swapped out with an upgrade with minimal effect (or so the theory goes).

## Steps to perform when making the upgrade

* ssh to the new server (from e.g. ol-home) to verify that the host is accessible, and is the expected host with the expected operating system 
for Ubuntu: `lsb_release -a`

* Test that the new memcached server is up and responsive (memcached telnet command to verify the memcache server is accepting connections and is at the expected version, check memory and utilisation stats)

```
telnet ol-mem4 11211

version
stats
stats items
quit
```

* ensure the memcache pool configuration is updated and _loaded_ for both Open Library _and_ Infobase. Update and restart the appropriate services.

## Post upgrade testing

* Make a test edit to an Open Library item and confirm the record is updated as expected, and the edit history is current and shows the correct difference, with an appropriately incremented version number.

* Monitor community edits post upgrade over a period of a few days to looks for any unexpected behaviour. Since there is a pool (some edits may be cached correctly while some have problem), and caching issues may take some time to manifest, proving a single edit looks good is not sufficient to indicate an all clear. Multiple edits should be checked daily to rule out the possibility of less obvious issues. Check a range of data types. Editions, Works, Authors, Lists, Newly added items etc.

* Place a notification in the `#openlibrary-g` channel to notify the community that a change has been made, and ask for anyone who notices anything unusual with regards to edit changes being saved to speak out in the channel and contact @mek or @charles.
