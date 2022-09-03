# Manually Running Dumps

Data dumps are introduced at https://openlibrary.org/developers/dumps

Successful data dumps are transferred to https://archive.org/details/ol_exports?sort=-publicdate

Data dumps should be created on `ol-home0` within the `openlibrary_cron-jobs_1` Docker container.
* `docker-compose.production.yml` defines `cron-jobs` Docker container.
* That container uses `docker/ol-cron-start.sh` to submit the cron jobs. 
* The jobs are defined in `olsystem/etc/cron.d/openlibrary.ol_home0`.

Data dumps (e.g. ol_dump.txt.gz) may be manually regenerated on `ol-home0` within the `openlibrary_cron-jobs_1` Docker container:

# Run an out-of-cycle Open Library Data Dump (Aug. 2022)
1. Log into the host `ol-home0`
2. `tmux`  # The data dumps are a long-running process and `tmux` enables reconnecting to a host that has been disconnected.
2. `cd /opt/openlibrary`
3. `docker ps`  # To ensure that `openlibrary_cron-jobs_1` is up and running
4. `docker exec -it -uroot openlibrary_cron-jobs_1 bash`
5. `crontab -l | less`  # to see the ol data dumps command
6. `ls /1/var/tmp/dumps`  # to see if there are data files that should be deleted
    1. We kept the raw database dump `data.txt.gz`
    2. We `rm -r oldumpsort` because we wanted to rebuild that
    3. We replaced the date logic with a date string
    4. We removed `—overwrite` to skip some early steps like extracting `data.txt.gz` from postgres
7. `cd /opt/openlibrary`  # just to be sure
8. `PSQL_PARAMS=‘-h ol-db1 openlibrary’ TMPDIR=‘/1/var/tmp’ OL_CONFIG=‘/olsystem/etc/openlibrary.yml’ su openlibrary -c “/openlibrary/scripts/oldump.sh 2022-07-31 —archive”`
9. Debug with `top` and also with `zcat /1/var/tmp/dumps_2022-07-31.txt.gz | head | less`

# Examine the dump process logs
1. Log into the host `ol-home0`
2. `docker logs openlibrary_cron-jobs_1 2>&1 | grep openlibrary.dump | less`

# Related Issues

https://github.com/internetarchive/openlibrary/issues/5402 - cron is presently broken
https://github.com/internetarchive/openlibrary/issues/5719 - fix for October 2021-10


# History

See original by @gdamdam at: http://gio.blog.archive.org/2015/03/11/ol-how-to-generate-the-dump-files/

# How it Works

## Dumping the DB

First step is dumping the data table from `ol-db1` -- this task requires around 1 hour to complete.

    you@ol-home:/1/var/tmp$ psql -h ol-db1 -U openlibrary openlibrary -c "copy data to stdout" | gzip -c > data.txt.gz

## Generate Metadata table dump from archive db

This task will also require ~1 hour to complete. Change the filename dates accordingly:

    you@ol-home:/1/var/tmp$ source /opt/openlibrary/venv/bin/activate # Activate virtual environment
    (venv)you@ol-home:/1/var/tmp$ ARCHIVE_DB_PASSWORD=`/opt/.petabox/dbserver`
    (venv)you@ol-home:/1/var/tmp$ python /opt/openlibrary/openlibrary/scripts/2012/dump-ia-items.py --host db-current --user archive --password $ARCHIVE_DB_PASSWORD --database archive | gzip -c > ia_metadata_dump_2015-03-11.txt.gz

## Generate Revision Dump

This will create a dump of all revisions of all documents and takes around 8 hours to complete:

    you@ol-home:/1/var/tmp$ source /opt/openlibrary/venv/bin/activate # Activate virtual environment
    (venv)you@ol-home:/1/var/tmp$ /opt/openlibrary/openlibrary/scripts/oldump.py cdump data.txt.gz 2015-03-11 | gzip -c > ol_cdump.txt.gz
    (venv)you@ol-home:/1/var/tmp$ rm data.txt.gz

## Generate Latest Revision Dump

Generate the dump of latest revisions of all documents. This task requires around 6 hours to complete.

    you@ol-home:/1/var/tmp$ source /opt/openlibrary/venv/bin/activate # Activate virtual environment
    (venv)you@ol-home:/1/var/tmp$ gzip -cd ol_cdump.txt.gz | python /opt/openlibrary/openlibrary/scripts/oldump.py sort --tmpdir /1/var/tmp | python /opt/openlibrary/openlibrary/scripts/oldump.py dump | gzip -c > ol_dump_2015-03-11.txt.gz
    (venv)you@ol-home:/1/var/tmp$ rm -rf /1/var/tmp/oldumpsort

## Splitting Dumps

Splitting the Dump into authors, editions, works, redirects:

    you@ol-home:/1/var/tmp$ source /opt/openlibrary/venv/bin/activate # Activate virtual environment
    (venv)giovanni@ol-home:/1/var/tmp$ gzip -cd ol_dump_2015-03-11.txt.gz | python /opt/openlibrary/openlibrary/scripts/oldump.py split --format ol_dump_%s_2015-03-11.txt.gz

## Generating Denormalized Works Dump

XXX: This script returns exceptions!
Each denormalized Work dump record/row is a JSON document with the following fields:

- work – The work documents
- editions – List of editions that belong to this work
- authors – All the authors of this work
- ia – IA metadata for all the ia items referenced in the editions as a list
- duplicates – dictionary of duplicates (key -> it’s duplicates) of work and edition docs mentioned above

    you@ol-home:/1/var/tmp$ source /opt/openlibrary/venv/bin/activate # Activate virtual environment
    (venv)you@ol-home:/1/var/tmp$ python /opt/openlibrary/openlibrary/scripts/2011/09/generate_deworks.py ol_dump_2015-03-11.txt.gz ia_metadata_dump_2015-03-11.txt.gz | gzip -c > ol_dump_deworks_2015-01-11.txt.gz

## Verify Dumps

    you@ol-home:/1/var/tmp$ source /opt/openlibrary/venv/bin/activate # Activate virtual environment
    (venv)you@ol-home:/1/var/tmp$ ls
    ia_metadata_dump_2015-03-11.txt.gz  ol_dump_2015-03-11.txt.gz
    ol_dump_redirects_2015-03-11.txt.gz ol_dump_authors_2015-03-11.txt.gz
    ol_dump_deworks_2015-01-11.txt.gz   ol_dump_editions_2015-03-11.txt.gz
    ol_dump_works_2015-03-11.txt.gz
