# Responding to a Outage

- [ ] Report outage on #ops and #openlibrary on Slack
- [ ] :exclamation: Review previous [post mortem](https://github.com/internetarchive/openlibrary/issues?q=label%3A%22Type%3A+Post-Mortem%22) reports for insights and solutions to common issues 
- [ ] Consult the [Troubleshooting](#Troubleshooting) section to identify likely suspects
- [ ] Check the [monitoring dashboards](https://github.com/internetarchive/openlibrary/wiki/Monitoring):
    - [NAGIOS](https://monitor.archive.org/cgi-bin/nagios3/status.cgi?hostgroup=24.openlibrary&style=detail)
    - [HAProxy](https://openlibrary.org/admin?stats)
    - https://status.archivelab.org/?admin=true - links to more org dashboards
- [ ] If the baremetal machine is hanging, contact #ops on slack or [manually restart baremetal](https://gnt-webmgr.us.archive.org/)
- [ ] If there's a fiber outage and openlibrary.org's servers don't resolve (even to Sorry service), ask in #openlibrary or #ops for openlibrary.org to be temporarily pointed to the active Sorry server
- [ ] Create a new [postmortem](https://github.com/internetarchive/openlibrary/issues/new?assignees=&labels=Type%3A+Post-Mortem%2C+Priority%3A+0%2C+GJ%3A+Triage+Exception&template=post_mortem.md&title=) issue

# Common Issues

## DDOS or Spam

See this page: https://github.com/internetarchive/openlibrary/wiki/Anti-Spam-Tools#handling-ddos-denial-of-service-attack

## Solr Search Issues

You can restart solr via docker as:

```
ssh -A ol-solr1
docker restart solr_builder_solr_1 solr_builder_haproxy_1
```

# Troubleshooting

Before continuing, you may want to check our [Port-mortems](https://github.com/internetarchive/openlibrary/issues?q=is%3Aissue+label%3A%22Type%3A+Post-Mortem%22+) to see if this is a known / already solved problem.

1. If solr-updater or import-bot or deploy issue, or infobase (API), check `ol-home`
2. If lending information e.g. books appear as available on OL when they are waitlisted on IA, this is a freak incident w/ memcached and we'll need to ssh into each memcached (ol-mem*) and `sudo service memcached restart`
3. If there's an issue with ssl termination, static assets, connecting to the website, check `ol-www1` (which is where all traffic enters and goes into haproxy -- which also lives on this machine). Another case is abuse, which is documented in the troubleshooting guide (usually haproxy limits or banning via nginx `/opt/openlibrary/olsystem/etc/nginx/deny.conf`
4. If there's a database problem, sorry (`ol-db0` primary, `ol-db1` replication, `ol-backup1`)
5. If we're seeing `ol-web1` and `ol-web2` offline, it may be network, upstream, DNS, or a breaking dependency, CHECK [NAGIOS](https://monitor.archive.org/cgi-bin/nagios3/status.cgi?hostgroup=24.openlibrary&style=detail) + alert #ops + #openlibrary. Check the logs in `/var/log/openlibrary/` (esp. `upstart.log`)
7. If you notice a disk filling up rapidly or almost out of space... CREATE A BASILISK FILE (an empty 2GB placeholder `dd`'d file that we can delete and have the ability to `ls`, etc)
8. Look at the troubleshooting guide history

- [Is the server having trouble after rebooting?](#Handling_Server_Reboot)
- [Is OpenLibrary getting slammed with traffic, crawlers, or bad actors?](#Handling_DDOS)
- [Is Search Overloading archive.org elastic search upstream?](#Overloaded_Search)

# Out of Space

## Cleanup Deploys

There are few servers which we expect to fill up. ol-db1/2 and ol-covers0/1 are candidates because their job is to store temporary or long term data. ol-home0 is another service which generates data dumps, aggregates partner data, and generates sitemaps. These three servers likely need a manual investigation when nagios reports their space is low.

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