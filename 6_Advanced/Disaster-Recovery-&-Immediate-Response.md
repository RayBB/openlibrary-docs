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

## Power Outages at Data Center

Once services return, please make sure all services are running and that VMs are ssh'able (this can probably be a script).

If a machine is up but not reachable, [manually restart baremetal](https://gnt-webmgr.us.archive.org/).
If a machine is up and reachable but services are not running, check `docker ps` on the host.

## Handling Abuse & DDOS (Denial of Service Attack)

We have a few graphs on our main dashboard to [monitor the traffic of the top requesting IPs](https://grafana.us.archive.org/d/000000176/open-library-dev?orgId=1&refresh=1m&from=now-24h&to=now) to observe changes in pattern/behaviour:

![image](https://github.com/internetarchive/openlibrary/assets/6251786/d4c6a6ed-0a48-47b4-a9bc-cf1f8c7b6ee5)

These graphs show the ratio between the last ~20k requests across the top IPs hitting our website. E.g. the green section in the first graph, what ratio of requests came from the top IP. The yellow is from the second top-most IP. And so on.

In the graph above, you can see several anomalies where the top IP has been making significantly more requests. This is an indicator that there might be abuse happening from a certain IP.

Treatment: Investigate and block the IP as necessary.

1. Investigate the traffic to verify. On the server in question (eg `ssh -A ol-www0`):

```sh
# Observe the recent requests hitting the server. Note 150000 is largely arbitrary.
$ sudo tail -n 150000 /1/var/log/nginx/access.log | grep -oE '^[0-9.()]+' | sort | uniq -c | sort -rn | head -n 25
# 154598 0.32.37.207
# 125985 0.3.111.38
# 124110 0.45.210.121
# 123793 0.249.158.151
# 122969 0.79.152.249
# 122872 0.244.113.216
# 122526 0.30.143.17
# 121269 0.145.106.249
# 120520 0.85.80.58
# 117442 0.141.6.36
# 109663 0.204.1.42
#  90027 0.109.144.144
#  81801 0.218.22.254
#  ...
```

You can see the top IP (note the IPs are anonymoized) is causing a considerable amount of traffic. Let's investigate it.

```sh
$ sudo tail -f /1/var/log/nginx/access.log | grep -F '0.32.37.207'
```

This will let you see the traffic from that IP and determine if it should be blocked. Use your discretion to check any given IP to see whether the pattern looks abusive / spammy -- e.g. Internet Archive makes many requests to /api/books.json and still we don't want to ban it, for example. If you determine it should be blocked, then we need to get the denanoymized IP and add it to our deny.conf. 

On `ol-www0` in `/openlibrary` you can run `decode_ip.sh` with the offending anonymized IP `0.32.37.207` as follows:
```
cd /opt/openlibrary/scripts
sudo -E SEED_PATH=http://seedserver.us.archive.org/key/seed.txt ./decode_ip.sh 0.32.37.207
```
Note: if you run `decode.sh` and get a file not found error, run it again. This is a work around until a fix is merged for a race condition around the creation of the IP map.

If for some reason `decode_ip.sh` is not working, as a last resort, you can disable anonymization temporarily by editing `/opt/openlibrary/docker/nginx.conf` to add `($remote_addr)` to the start of `log_format` in `nginx.conf` to de-anonymize IPs:

```
log_format iacombined '($remote_addr) $remote_addr_ipscrub $host $remote_user [$time_local] "$request" $status $body_bytes_sent "$http_referer" "$http_user_agent" $request_time';
```

3. `docker restart openlibrary-web_nginx-1`
4. Find the real IP. Either use a custom regex to find the same requests again (if there's something unique about them you can grep with) or run the command from the beginning again over the last few minutes to find the deanonymized version of the IP:

```sh
$ sudo tail -n 17000 /1/var/log/nginx/access.log | grep -oE '^[0-9.()]+' | sort | uniq -c | sort -rn | head -n 25
``` 

5. Add the `deny` rules for individual abusing IPs to /opt/olsystem/etc/deny.conf or update the rules in `/opt/openlibrary/docker/web_nginx.conf` to deny IPs or user-agents in specific cases. Because `/opt/olsystem/etc/nginx/deny.conf` is in olsystem, which is volumed mounted, **and** the docker nginx files in `/opt/openlibrary` are volume mounted, simply  edit the files and restart the nginx docker container to apply your changes.

6. Confirm offending IPs appear to be blocked back on ol-www1, e.g. look for 403's:

```
sudo tail -f /1/var/log/nginx/access.log | grep "XXX.XXX.XXX"

YYY.YYY.YYY.YYY openlibrary.org - [01/Dec/2023:20:14:45 +0000] "GET /authors/OL7283999A/Petala_Parreira?sort=random_1701448397.338931&mode=everything HTTP/2.0" 403 185 "-" "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.6045.123 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" 0.000 IP:XXX.XXX.XXX.XXX
```

8. Undo temporary IP de-anonymization by removing the `($remote_addr)` segment of `/opt/openlibrary/docker/nginx.conf` in the `log_format` rule:

```
log_format iacombined '$remote_addr_ipscrub $host $remote_user [$time_local] "$request" $status $body_bytes_sent "$http_referer" "$http_user_agent" $request_time;
```

9. And then restart everything one last time: `docker restart openlibrary-web_nginx-1`

See related outage events: https://github.com/internetarchive/openlibrary/wiki/Disaster-History-Log#2017-11-09-1000pm-pst

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