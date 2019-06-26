# Responding to a Outage

- [ ] Report outage on #ops and #openlibrary on Slack
- [ ] Consult the [Troubleshooting](#Troubleshooting) section to identify likely suspects
- [ ] Identify issues using our [stats dashboard](http://ol-home.us.archive.org:8088/dashboard) and [open library nagios alerts](https://monitor.archive.org/cgi-bin/nagios3/status.cgi?hostgroup=24.openlibrary&style=detail) 
- [ ] If the baremetal machine is hanging, contact #ops on slack or [manually restart baremetal](https://gnt-webmgr.us.archive.org/)
- [ ] If there's a fiber outage and openlibrary.org's servers don't resolve (even to Sorry service), ask in #openlibrary or #ops for openlibrary.org to be temporarily pointed to the active Sorry server

# Troubleshooting

- [Is the server having trouble after rebooting?](#Handling_Server_Reboot)
- [Is OpenLibrary getting slammed with traffic, crawlers, or bad actors?](#Handling_DDOS)
- [Is Search Overloading archive.org elastic search upstream?](#Overloaded_Search)

# Handling DDOS

First, ssh over to `ol-www1` (which is the entry point for all traffic) and determine who the bad actor(s) are. Because we anonymize IPs, you'll first have to populate a map of anonymous IPs to IPs we can actually block:

```
ssh -A ol-www1
netstat -n | /home/samuel/work/reveal-abuse/mktable  # XXX this should probably be added to `olsystem`, see: https://github.com/internetarchive/olsystem/issues/45
```

Then run:

```
sudo tail -n 5000 /var/log/nginx/access.log | cut -d ' ' -f 1 | sort | uniq -c  | sort -n | tail -n 10 | /home/samuel/work/reveal-abuse/reveal | /home/samuel/work/reveal-abuse/shownames
```

At this point, you can add the IPs to /olsystem/etc/nginx/deny.conf or add classes of IPs or user-agents to `/etc/nginx/sites-available/openlibrary.conf`, e.g.:

```
    if ($http_user_agent ~* (Slurp|Yahoo|libwww-perl|Java)) {
        return 403;
    }
```

Or, you can block on a per-IP basis in `/opt/openlibrary/olsystem/etc/nginx/deny.conf`.

# Handling Server Reboot

When `ol-web3` or `ol-web4` are restarted, there is a chance one of them may have trouble restarting. You can usually learn why by looking in /var/log/openlibrary/upstart. Chances are it will complain about upstart.log being unwritable and or there being no directory /var/run/openlibrary owned by openlibrary. First, we should find out why this happens! To fix:

```
ssh -A ol-web3 # or ol-web4
sudo chown openlibrary:openlibrary /var/log/openlibrary/upstart.log
sudo mkdir /var/run/openlibrary
sudo chown openlibrary:openlibrary /var/run/openlibrary
```

Make sure solr-updater is up and run ol-solr-indexer.py to sync any skipped OL db -> OL solr records:

```
/olsystem/bin/olenv python /opt/openlibrary/openlibrary/scripts/ol-solr-indexer.py --config /olsystem/etc/openlibrary.yml --bookmark ol-solr-indexer.bookmark --backward --days 180
```

Restart OLBot from ol-home and then confirm it's working:

```
sudo -u openlibrary /olsystem/bin/olenv HOME=/home/openlibrary OPENLIBRARY_RCFILE=/olsystem/etc/olrc-importbot python scripts/manage-imports.py --config /olsystem/etc/openlibrary.yml import-all >> /tmp/importer.log
```

# Out of Space

## Cleanup Deploys

Sometimes too many deploys accumulate in `/opt/openlibrary/deploys/openlibrary` on our `ol-` servers. Usually, the solution to free up space is to remove files from previous years or months. For instance, the following removes all old deploys from the year 2017 in order to free up space:

```
ssh -A ol-web3  # etc
cd /opt/openlibrary/deploys/openlibrary
ls -lathr | grep 2017 | awk 'NF>1{print $NF}' | sudo xargs rm -r`
```

## upstart.log
There is a possibility supervisor can get confused (perhaps related to permissions/`chown`), and instead of rotating logs, will start writing to `/var/log/openlibrary/upstart.log` until `/dev/vda1` (or wherever root / is mounted) runs out of space. The solution is to restart "supervisor" (not openlibrary via supervistorctl but supervisor itself) on the aflicted node (e.g. `ol-web4` in this example):

```
sudo service supervisor restart
```

If successful, you should see a new openlibrary.log with an update time more recent than upstart.log. One you've confirmed this, you can truncate the erroneously inflated upstart.log to free up disk space:

```
sudo truncate upstart.log  --size 0
```

After truncating, you'll want to restart `openlibrary`, e.g.

```
ssh ol-web4 sudo supervisorctl restart openlibrary
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
      * https://github.com/internetarchive/openlibrary/wiki/Disaster-Recovery#overloaded-search
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