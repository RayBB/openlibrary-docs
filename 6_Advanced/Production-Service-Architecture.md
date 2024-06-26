## UPDATES
- 2019: `ol-mem[0-2]` trusty VMs have been reprovisioned as `ol-mem[3-5]` following the [Provisioning Guide](https://github.com/internetarchive/openlibrary/wiki/Provisioning-Guide)
- Dec. 2020: Migration to Docker-based deployments based on docker compose
- Jan. 2021: Upgrade to Infogami master and drop `docker-compose.infogami-local.yml`
- Oct./Nov. 2021: Decomission ol-mem{3,4,5} on Ubuntu Xenial in favor of ol-mem{0,1,2} on Ubuntu Focal

## Server Types

@cclauss, please update this section w/ instructions + commands on how to provision each of the following. We likely need to take into consideration `ferm`, `docker` install, services like haproxy + nginx + memcache, hb.conf (ips allow list for ol-db), & importantly olsystem updates, updating dns.

* ol-mem
* ol-web
* ol-solr
* ol-covers
* ol-home
* ol-www
* ol-dev
* ol-db

For ol-web, ol-home, ol-www, and ol-solr, we run something roughly equivalent to this [setup](https://github.com/internetarchive/openlibrary/pull/3938/files#diff-3b30bef8970e22874431ef6aa3d67073bddc40ba78dc7e5a6c86e549a15b5706) script

## Current Production Architecture
Today, our production service architecture consists of the following hosts and Docker containers[:](https://github.com/internetarchive/olsystem/wiki/Open-Library-hosts)

hostname | Docker image | long name | notes
--- | --- | --- | ---
ol-backup0 | None | bare-metal | **Trusty**
ol-covers0 | covers | openlibrary-covers-1 & 2| |
ol-covers0 | **covers_nginx** | openlibrary-covers_nginx-1 | underscore
ol-db1 & 2 | None | postgres on bare-metal -- no Docker | **Trusty**
ol-home0 | affiliate-server | openlibrary-affiliate-server-1 |
ol-home0 | cron-jobs | openlibrary-cron-jobs-1 |
ol-home0 | importbot | openlibrary-importbot-1 |
ol-home0 | infobase | openlibrary-infobase-1 |
ol-home0 | infobase_nginx | openlibrary-infobase_nginx-1 | underscore
ol-home0 | solr-next-updater | openlibrary-solr-next-updater-1 |
ol-home0 | solr-updater | openlibrary-solr-updater-1 |
ol-mem0, 1, 2 | None | memcached on bare metal -- no Docker |
ol-solr0 & 1 | solr | openlibrary_solr_1 | underscore
ol-solr0 & 1 | solr_haproxy | openlibrary_solr_haproxy_1 | underscore
ol-solr0 & 1 | solr_restarter | openlibrary_solr_restarter_1 | underscore
ol-web1 & 2 | web | openlibrary-web-1 | |
ol-www0 | web_haproxy | openlibrary-web_haproxy-1 | underscore |
ol-www0 | **web_nginx** | openlibrary-web_nginx-1 | underscore |

### Docker hostnames
hardware hostname | container name | docker hostname
--- | --- | --- 
ol-covers0 | openlibrary-covers-1 | docker-ol-covers0-covers-1
ol-covers0 | openlibrary-covers-2 | docker-ol-covers0-covers-2
ol-covers0 | openlibrary-covers_nginx-1 | docker-ol-covers0-covers_nginx-1
ol-home0 | openlibrary-affiliate-server-1 | docker-ol-home0-
ol-home0 | openlibrary-cron-jobs-1 | docker-ol-home0-cron-jobs-1
ol-home0 | openlibrary-importbot-1 | docker-ol-home0-importbot-1
ol-home0 | openlibrary-infobase-1 | docker-ol-home0-infobase-1
ol-home0 | openlibrary-infobase_nginx-1 | docker-ol-home0-infobase_nginx-1
ol-home0 | openlibrary-solr-next-updater-1 | docker-ol-home0-solr-next-updater-1
ol-home0 | openlibrary-solr-updater-1 | docker-ol-home0-solr-updater-1
ol-solr0 | openlibrary_solr_1 | docker-ol-solr0-solr_1
ol-solr0 | openlibrary_solr_haproxy_1 | docker-ol-solr0-solr_haproxy_1
ol-solr0 | openlibrary_solr_restarter_1 | docker-ol-solr0-solr_restarter_1
ol-solr1 | jenkins | docker-ol-solr1-jenkins
ol-solr1 | openlibrary_solr_haproxy_1 | docker-ol-solr1-solr_haproxy_1
ol-solr1 | solr_builder-solr_prod-1 | docker-ol-solr1-solr_prod-1
ol-web1 | openlibrary-web-1 | docker-ol-web1-web-1
ol-web2 | openlibrary-web-2 | docker-ol-web2-web-1
ol-www0 | openlibrary-web_haproxy-1 | docker-ol-www0--web_haproxy-1
ol-www0 | openlibrary-web_nginx-1 | docker-ol-www0--web_nginx-1

![Open Library Production Architecture](https://archive.org/download/openlibrary-documentation/openlibrary-production-architecture.png)

## Current Provisioning Setup
Our current production setup process (as of 2021) for provisioning these Docker containers is **manual** and relies on a lot of manually rsync-ing images around, as well as a separate repository called `olsystem` which contains the production configs, cron jobs, and infrastructure required to run the official openlibrary.org service.

Our Docker containers are more-or-less provisioned identically:
- The `compose*.yaml` files at openlibrary's root directory contains the Docker configuration data for each container
- These containers may mount external volumes such as `olsystem`, `petabox`, and `1` to access config and shared data.
- `/opt/openlibrary` contains the business logic for the Open Library project:
```
/opt/
/opt/petabox
/opt/openlibrary
/opt/openlibrary/venv  -- python virtualenv
/opt/openlibrary/maxmind-geoip/  -- .dat file for anonymizing IPs
/opt/openlibrary/deploys  -- history of all deploys, hash-binned by service
/opt/openlibrary/deploys/openlibrary  -- history of openlibrary deploys
/opt/openlibrary/deploys/olsystem  -- history of openlibrary deploys
/opt/openlibrary/deploys/base  -- deprecated??
/opt/openlibrary/deploys/openlibrary/openlibrary  -- active openlibrary deploy
/opt/openlibrary/deploys/openlibrary/openlibrary  -- active olsystem deploy
/opt/openlibrary/olsystem/  -- symlink to active olsystem: /opt/deploys/openlibrary/olsystem
/opt/openlibrary/openlibrary -- symlink to active openlibrary: /opt/deploys/openlibrary/olsystem
```

At a minimum, re-provisioning a container requires:
- setting up firewall rules and installing core packages (e.g. git, docker) by running an ansible playbook
- rsync-ing over the legacy VM's `/opt` directory (preferably as an external mountable `/1` volume which can be moved in the future)
- Setting up `olsystem` so that its files within `/opt/openlibrary/olsystem/etc` symlink to the right locations within `/etc`

## Replace a memcache server (Nov. 2021)

When provisioning a new memcached server, remember to update/edit `/etc/memcached.conf` to increase the `-m` setting to use whatever resources are available on the machine (less perhaps 300mb for OS level memory needs -- e.g. perhaps if the machine has 9.7GB, use -m 9300 or a bit higher). By default memcached only uses 64mb.

* [x] ~ol-mem5~ --> ol-mem0 in [internetarchive/olsystem#138](https://github.com/internetarchive/olsystem/pull/138)
* [x] ~ol-mem4~ --> ol-mem1 in [internetarchive/olsystem#144](https://github.com/internetarchive/olsystem/pull/144) (06 Dec 2021)
* [x] ~ol-mem3~ --> ol-mem2 in [internetarchive/olsystem#145](https://github.com/internetarchive/olsystem/pull/145) (?? Dec 2021)

## Performing Upgrades

This is in response to https://github.com/internetarchive/openlibrary/issues/7667. When performing upgrades on production servers, follow a similar process to https://github.com/internetarchive/openlibrary/wiki/Disaster-Recovery-&-Immediate-Response#responding-to-a-outage re:
- [ ] create a new tracking issue on GitHub to keep notes and track progress.
- [ ] notifying the #openlibrary channel and ensuring other staff are available prior to performing a deploy (try to get a 👍 from other staff to confirm)
- [ ] provide evidence in our announcement that a previous test succeeded (if possible) on a non-critical-path machine (dev1, web1, web2, solr1, solr0, ol-covers, ol-home0, ol-www0] -- in this order)
- [ ] In advance of the upgrade, suggest a path for reversion (e.g. have a strategy to roll-back if possible)

Order of upgrades -- Wait for each one fully reboot and ensure that it works as expected (take good notes!):
- ol-dev 
- ol-web1
- ol-web2
- ol-solr1
- ol-solr2
- ol-covers
- ol-home
- ol-www0
See: https://github.com/internetarchive/openlibrary/pull/7626#discussion_r1133252975