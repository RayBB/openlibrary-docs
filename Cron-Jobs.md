## Updating Cron Jobs on ol-home0

The following will set the correct ENV variables (`HOSTNAME` & `COMPOSE_FILE`), put you in the right path (i.e. `/opt/openlibrary`), remove the existing `openlibrary_cron-jobs_1 container`, rebuild a fresh container.

```bash:
$ cd /opt/openlibrary
$ export HOSTNAME=$HOSTNAME;export COMPOSE_FILE="docker-compose.yml:docker-compose.production.yml";sudo docker rm -f openlibrary_cron-jobs_1;docker compose --profile ol-home0 up -d --no-deps cron-jobs
```

## Connecting to Cron Docker

You may then enter the container with a bash session by running:

```bash:
$ sudo docker exec -it -uroot openlibrary_cron-jobs_1 bash
```

## Verifying Crons Running on ol-home0 Docker

Once you're bash'd in to the Cron container, you can:

```
$ tail /var/log/cron.log
```

...And should see useful output (and not e.g. `/bin/sh: 1: root: not found`)

## Running Cron Jobs on ol-home0

First, shell into the docker container for cron jobs:
```sudo docker exec -it -uroot openlibrary_cron-jobs_1 bash```

### Homepage Stats

Run:
```bash
$ /openlibrary/scripts/store_counts.py /olsystem/etc/infobase.yml /olsystem/etc/openlibrary.yml /olsystem/etc/coverstore.yml 30
```
Which produces:
```
root@ol-home0:/etc/cron.d# /openlibrary/scripts/store_counts.py /olsystem/etc/infobase.yml /olsystem/etc/openlibrary.yml /olsystem/etc/coverstore.yml 30
INFO     : stats.py    : 110 : Parsing config file
DEBUG    : stats.py    :  40 :  Postgres Database : openlibrary
DEBUG    : stats.py    :  40 :  Postgres Database : coverstore
2021-05-07 22:50:44 [7965] [openlibrary] [INFO] Application init
2021-05-07 22:50:44 [7965] [openlibrary] [INFO] loading plugin openlibrary
2021-05-07 22:50:44 [7965] [openlibrary] [INFO] loading plugin worksearch
2021-05-07 22:50:44 [7965] [openlibrary] [INFO] loading plugin inside
2021-05-07 22:50:44 [7965] [openlibrary] [INFO] loading plugin books
2021-05-07 22:50:44 [7965] [openlibrary] [INFO] loading plugin admin
2021-05-07 22:50:44 [7965] [openlibrary] [INFO] loading plugin upstream
2021-05-07 22:50:44 [7965] [openlibrary] [INFO] loading plugin importapi
2021-05-07 22:50:44 [7965] [openlibrary] [INFO] loading plugin recaptcha
2021-05-07 22:50:44 [7965] [openlibrary] [INFO] loading complete.
2021-05-07 22:50:44 [7965] [infobase] [INFO] loading plugin openlibrary.olbase
2021-05-07 22:50:44 [7965] [infobase.ol] [INFO] logging initialized
2021-05-07 22:50:44 [7965] [openlibrary.olbase] [INFO] setting up infobase events for Open Library
2021-05-07 22:50:44 [7965] [openlibrary.admin.stats] [INFO] Gathering total data
2021-05-07 22:52:17 [7965] [openlibrary.admin.stats] [INFO]   admin_total__authors - 8466756
2021-05-07 22:52:32 [7965] [openlibrary.admin.stats] [INFO]   admin_total__covers - 10642558
2021-05-07 22:52:32 [7965] [openlibrary.admin.stats] [INFO]   admin_total__ebooks - 0
                
2021-05-07 22:55:11 [7965] [openlibrary.admin.stats] [INFO]   admin_total__editions - 30212025
2021-05-07 22:55:15 [7965] [openlibrary.admin.stats] [INFO]   admin_total__lists - 142861
2021-05-07 22:56:02 [7965] [openlibrary.admin.stats] [INFO]   admin_total__members - 4578437
2021-05-07 22:56:02 [7965] [openlibrary.admin.stats] [INFO]   admin_total__subjects - 0
2021-05-07 22:57:29 [7965] [openlibrary.admin.stats] [INFO]   admin_total__works - 22285588
2021-05-07 22:57:29 [7965] [openlibrary.admin.stats] [INFO] Gathering data using difference between totals
2021-05-07 22:57:29 [7965] [openlibrary.admin.stats] [INFO]   admin_delta__ebooks - 0
2021-05-07 22:57:29 [7965] [openlibrary.admin.stats] [INFO]   admin_delta__subjects - 0
2021-05-07 22:57:29 [7965] [openlibrary.admin.stats] [INFO] Gathering range data
2021-05-07 22:57:29 [7965] [openlibrary.admin.stats] [INFO]  2021-05-07 00:00:00 to 2021-05-07 22:57:29.444198
2021-05-07 22:57:29 [7965] [openlibrary.admin.stats] [INFO]   admin_range__authors - 2567
2021-05-07 22:57:29 [7965] [openlibrary.admin.stats] [INFO]   admin_range__bot_edits - 15831
2021-05-07 22:57:29 [7965] [openlibrary.admin.stats] [INFO]   admin_range__covers - 7848
2021-05-07 22:57:29 [7965] [openlibrary.admin.stats] [INFO]   admin_range__editions - 7658
2021-05-07 22:57:29 [7965] [openlibrary.admin.stats] [INFO]   admin_range__human_edits - 5910
2021-05-07 22:57:29 [7965] [openlibrary.admin.stats] [INFO]   admin_range__lists - 21
2021-05-07 22:57:29 [7965] [openlibrary.admin.stats] [INFO]   admin_range__loans - 12244
2021-05-07 22:57:29 [7965] [openlibrary.admin.stats] [INFO]   admin_range__members - 1942
2021-05-07 22:57:29 [7965] [openlibrary.admin.stats] [INFO]   admin_range__users - 1942
2021-05-07 22:57:29 [7965] [openlibrary.admin.stats] [WARNING]   admin_range__visitors - No statistics available
2021-05-07 22:57:29 [7965] [openlibrary.admin.stats] [INFO]   admin_range__works - 5613
2021-05-07 22:57:29 [7965] [openlibrary.admin.stats] [INFO] Removing sqlite file used for ipstats
```

### Running Import Bot Daemon

```
ol-home0:~$ docker exec -it openlibrary_importbot_1 bash
scripts/manage-imports.py --config "$OL_CONFIG" import-all
```

### Monthly Data Dumps
* https://github.com/internetarchive/openlibrary/wiki/Generating-Data-Dumps

You may want to run the following in tmux or gnu screen to establish a persistent connection as dumps may take several days to generate:

```
ssh -A ol-home0
tmux  # This will allow you to reconnect if your terminal gets disconnected!!
docker exec -it -uroot openlibrary_cron-jobs_1 bash
```
Once inside the Docker instance...
```
PSQL_PARAMS='-h ol-db1 openlibrary' TMPDIR='/1/var/tmp' OL_CONFIG='/olsystem/etc/openlibrary.yml' su openlibrary -c "/openlibrary/scripts/oldump.sh `date -d 'yesterday' +\%Y-\%m-\%d` --archive --overwrite" > /proc/1/fd/1 2>/proc/1/fd/2
```
OPTIONAL: To monitor progress in a second terminal tab:
```
ssh -A ol-home0
ps -ef  # To see if your job is running with yesterday's date
docker logs -f --tail=500 openlibrary_cron-jobs_1 2>&1 | grep dump
```

### Archive.org Imports

#### Adding 1 day

```bash:
python /openlibrary/scripts/manage-imports.py --config /olsystem/etc/openlibrary.yml add-new-scans
```

```
2021-05-07 23:02:08 [8404] [infobase.ol] [INFO] logging initialized
2021-05-07 23:02:08 [8404] [openlibrary.olbase] [INFO] setting up infobase events for Open Library
2021-05-07 23:02:12 [8404] [openlibrary.imports] [INFO] batch new-scans-202105: adding 4476 items
2021-05-07 23:02:12 [8404] [openlibrary.imports] [INFO] batch new-scans-202105: 4476 items are already present, ignoring...
```

#### Adding backwards in time

Note: This requires an .olrc file, e.g. `/olsystem/etc/olrc-importbot`

```
OPENLIBRARY_RCFILE=/olsystem/etc/olrc-importbot python /openlibrary/scripts/manage-imports.py --config /olsystem/etc/openlibrary.yml import-retro
```