# Responding to a Outage

- [ ] 1. Report outage on `#openlibrary` and `#ops` on Slack
- [ ] 2. :exclamation: **Search** previous [post mortem](https://github.com/internetarchive/openlibrary/issues?q=label%3A%22Type%3A+Post-Mortem%22) reports for insights and solutions to common issues 
- [ ] 3. Consult the [First Responder's Quickstart & Troubleshooting](#Troubleshooting) section to identify likely suspects
- [ ] 4. Check the [monitoring dashboards](https://github.com/internetarchive/openlibrary/wiki/Monitoring):
    - [NAGIOS](https://monitor.archive.org/cgi-bin/nagios3/status.cgi?hostgroup=24.openlibrary&style=detail)
    - [HAProxy](https://openlibrary.org/admin?stats)
    - https://status.archivelab.org/?admin=true - links to more org dashboards
- [ ] 5. If the baremetal machine is hanging, contact #ops on slack or [manually restart baremetal](https://gnt-webmgr.us.archive.org/)
- [ ] 6. If there's a fiber outage and openlibrary.org's servers don't resolve (even to Sorry service), ask in #openlibrary or #ops for openlibrary.org to be temporarily pointed to the active Sorry server
- [ ] 7. Create a new [postmortem](https://github.com/internetarchive/openlibrary/issues/new?assignees=&labels=Type%3A+Post-Mortem%2C+Priority%3A+0%2C+GJ%3A+Triage+Exception&template=post_mortem.md&title=) issue

# Diagnostic's Guide

Before continuing, you may want to check our [Port-mortems](https://github.com/internetarchive/openlibrary/issues?q=is%3Aissue+label%3A%22Type%3A+Post-Mortem%22+) to see if this is a known / already solved problem.

1. Is [CPU load high on web nodes](https://grafana.us.archive.org/d/b7a222a0-d4fe-49a4-a5c4-b071ce756fda/ol-cluster-load?orgId=1&refresh=1m) and/or is there a [spike in # of transactions](https://sentry.archive.org/organizations/ia-ux/alerts/rules/details/23/)?
    * [Handling Abuse & DDOS (Denial of Service Attack)](https://github.com/internetarchive/openlibrary/wiki/Disaster-Recovery-&-Immediate-Response#handling-abuse--ddos-denial-of-service-attack)
2. Are `ol-mem*` slow to ssh into? We may want to `/etc/init.d/memcached restart` or even [manually restart bare-metal](https://gnt-webmgr.us.archive.org/cluster/cluster1#virtual_machines) if ssh hangs for more than 3 minutes
3. Does [homepage cache](#Homepage_Errors) look weird?
## Spam

1. There is an admin dashboard for blocking certain terms from appearing on Open Library: https://openlibrary.org/admin/spamword
2. You can also block & revert changes per specific accounts via https://openlibrary.org/admin/people
  * If the edit to a page contains any of the spam words or email of the user is from the blacklisted domains, the edit won’t be accepted. New registrations with emails from those domains are also not accepted.

## Handling Abuse & DDOS (Denial of Service Attack)

See related outage events: https://github.com/internetarchive/openlibrary/wiki/Disaster-History-Log#2017-11-09-1000pm-pst

In 2023, we hit a case where a set of IPs was rapidly accessing our Books pages on Open Library. We did not have access to Sam's scripts for de-anonymizing IPs to detect abuse. This was the process for resolving the DDOS: https://github.com/internetarchive/openlibrary/issues/8319#issuecomment-1741323936

1. `ssh -A ol-www0`
2. edit `/opt/openlibrary/docker/nginx.conf` to add `($remote_addr)` to the **end** (must be end) of `log_format` in `nginx.conf` to de-anonymize IPs:

```
log_format iacombined '$remote_addr_ipscrub $host $remote_user [$time_local] "$request" $status $body_bytes_sent "$http_referer" "$http_user_agent" $request_time IP:$remote_addr';
```

3. `docker restart openlibrary-web_nginx-1`
4. Identify high-volume IPs

```
sudo cat /1/var/log/nginx/access.log | grep "IP:" | awk -F 'IP:' '{print $2}' | sort | uniq -c | sort -rn | head -n 100
``` 

5. Use your discretion to check any given IP to see whether the pattern looks abusive / spammy -- e.g. Internet Archive makes many requests to /api/books.json and still we don't want to ban it. e.g.

```
sudo cat /1/var/log/nginx/access.log | grep "IP:XXX.XXX.XXX.XXX"  # check one IP XXX.XXX.XXX.XXX at a time
sudo cat /1/var/log/nginx/access.log | grep "IP:" | awk -F 'IP:' '{print $2}' | sort | uniq -c | sort -rn | head -n 100 | awk '{print $2}' | sudo xargs -I{} grep {} /1/var/log/nginx/access.log # skim all requests by top 100 requesting IPs
```

6. Add the `deny` rules for individual abusing IPs to /opt/olsystem/etc/deny.conf or update the rules in `/opt/openlibrary/docker/web_nginx.conf` to deny IPs or user-agents in specific cases. Because `/opt/olsystem/etc/nginx/deny.conf` is in olsystem, which is volumed mounted, **and** `/opt/openlibrary` is also volume mounted on `ol-www0`, simply restarting docker or exec'ing in and reloading nginx after changes are made should apply your changes.

```
sudo docker exec -it -uroot openlibrary-web_nginx-1 bash
```

7. Confirm offending IPs appear to be blocked back on ol-www1, e.g. look for 403's:

```
sudo tail -f /1/var/log/nginx/access.log | grep "IP:XXX.XXX.XXX"

YYY.YYY.YYY.YYY openlibrary.org - [01/Dec/2023:20:14:45 +0000] "GET /authors/OL7283999A/Petala_Parreira?sort=random_1701448397.338931&mode=everything HTTP/2.0" 403 185 "-" "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.6045.123 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" 0.000 IP:XXX.XXX.XXX.XXX
```

8. Undo temporary IP de-anonymization by removing the trailing `IP:$remote_addr'` segment of `/opt/openlibrary/docker/nginx.conf` in the `log_format` rule:

```
log_format iacombined '$remote_addr_ipscrub $host $remote_user [$time_local] "$request" $status $body_bytes_sent "$http_referer" "$http_user_agent" $request_time;
```

9. And then restart everything one last time: `docker restart openlibrary-web_nginx-1`

## Solr Search Issues

You can restart solr via docker as:

```
ssh -A ol-solr1
docker restart solr_builder_solr_1 solr_builder_haproxy_1
```


# Out of Space

## Cleanup Deploys

There are few servers which we expect to fill up. ol-db1/2 and ol-covers0/1 are candidates because their job is to store temporary or long term data. ol-home0 is another service which generates data dumps, aggregates partner data, and generates sitemaps. These three servers likely need a manual investigation when nagios reports their space is low.

The following will prune unattached images which were created more than 1 week ago (168h):

```
docker image prune -a --filter "until=168h"
```

## Docker images

Even with this being the case, a very common cause of disk fill are out docker images which have not been pruned during our deploy process. These can be many GB over time. Run `docker image ls` for a listing of images registered in docker to see if any of them can be pruned or deleted.

## Docker Logs

Docker logs can take up a ton of space. @cdrini mentions one solution is:
(Truncating docker logs for container with ID d12b...)
```
sudo df -h - See the sizes of a bunch of things on the VM
truncate -s 0 $(docker inspect --format='{{.LogPath}}' d12b518475e1)
```

## ol-dev1 out of storage

Symptom: `sudo df -h` shows a bunch of `100%` or `99%`. Testing deploys might fail on occasion.

Containers and images can stick around on our dev server causing it to fill up. To free up space:

1. Confirm with folks on slack, #team-abc, that there are not stopped containers that people care about. There shouldn't be. There is some risk of data loss if someone has made modification to the file system inside a now stopped container. That is why we confirm!
2. Run `docker container prune`
3. Run `docker images prune` . This will remove any images; all images should have `Dockerfiles` somewhere, so there's little risk of data loss. But it might be annoying because someone will have to rebuild a docker image they might care about and have to find the `Dockerfile`!

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

# Homepage Errors

Sometimes an error occurs while compiling the homepage and an empty body is cached:
https://github.com/internetarchive/openlibrary/issues/6646

*Solution:* You can use this the url to hit to clear the homepage memcache entry: https://openlibrary.org/admin/inspect/memcache?keys=home.homepage.en.pd-&action=delete . Note the .pd . Remove that if you want to clear the cache for non printdisabled users.

## Notes
* If solr-updater or import-bot or deploy issue, or infobase (API), check `ol-home`
* If lending information e.g. books appear as available on OL when they are waitlisted on IA, this is a freak incident w/ memcached and we'll need to ssh into each memcached (ol-mem*) and `sudo service memcached restart`
* If there's an issue with ssl termination, static assets, connecting to the website, check `ol-www1` (which is where all traffic enters and goes into haproxy -- which also lives on this machine). Another case is abuse, which is documented in the troubleshooting guide (usually haproxy limits or banning via nginx `/opt/openlibrary/olsystem/etc/nginx/deny.conf`
* If there's a database problem, sorry (`ol-db0` primary, `ol-db1` replication, `ol-backup1`)
* If we're seeing `ol-web1` and `ol-web2` offline, it may be network, upstream, DNS, or a breaking dependency, CHECK [NAGIOS](https://monitor.archive.org/cgi-bin/nagios3/status.cgi?hostgroup=24.openlibrary&style=detail) + alert #ops + #openlibrary. Check the logs in `/var/log/openlibrary/` (esp. `upstart.log`)
* If you notice a disk filling up rapidly or almost out of space... CREATE A BASILISK FILE (an empty 2GB placeholder `dd`'d file that we can delete and have the ability to `ls`, etc)

- [Is the server having trouble after rebooting?](#Handling_Server_Reboot)
- [Is OpenLibrary getting slammed with traffic, crawlers, or bad actors?](#Handling_DDOS)
- [Is Search Overloading archive.org elastic search upstream?](#Overloaded_Search)