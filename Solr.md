## Solr Search Developer's Guide

[Apache Solr](https://solr.apache.org/features.html) is used to power the search box, but is also used internally by the system and is intrinsic to the correct operation of the system. Some examples of places that it's used include:
* Enumerating the list of works for an author
* Enumerating the list of editions for a work
* Autocomplete by author name when editing a work and selecting authors
* Various "top" things like the top items to list in a carousel, an author's top work or subjects, etc.

Proper operation of the Open Library Solr instance requires that it be updated when authors, works, and editions are edited or the search index will not correctly reflect the underlying database.

If you're looking to re-index solr, go here:
https://github.com/internetarchive/openlibrary/tree/master/scripts/solr_builder#solr-reindex-from-ol-dump

### Resources
* [Apache Solr Subject on Open Library](https://openlibrary.org/subjects/apache_solr)
* [Awesome Solr GitHub Resources](https://github.com/Anant/awesome-solr)

### Solr updater script
The [scripts/solr_updater.py](https://github.com/internetarchive/openlibrary/blob/master/scripts/solr_updater.py) file listens for edits from infogami, and updates the solr index accordingly.

- Forcing a restart if solr-updater stuck in restart loop:

```sh
### NOTE THE DATE!! Set that to where you want to restart from.
docker run --rm -it -v openlibrary_solr-updater-data:/solr-updater-data openlibrary/olbase:latest bash -c 'echo "2022-06-06:0" > /solr-updater-data/solr-next-update.offset'
docker run --rm -it -v openlibrary_solr-updater-data:/solr-updater-data openlibrary/olbase:latest bash -c 'echo "2022-06-06:0" > /solr-updater-data/solr-update.offset'
```

### Expected behavior and timings

Changes to the Solr index are _supposed_ to be visible on the live Open Library site in no more than [about 15 minutes](https://github.com/internetarchive/openlibrary/blob/c4d877ee6410df6f70ab45718baebe52fdf366ba/openlibrary/templates/admin/solr.html#L21), but the latency depends on how far the Solr updater is behind in processing the database update queue.

The updater script looks for document changes in the Infobase logs at `http://<internal-infobase-url>/openlibrary.org/log` and has _(possibly incomplete)_ logic to update Solr accordingly.

The updater script checks for updates every [5 seconds](https://github.com/internetarchive/openlibrary/blob/0748d2ab0db7966fd82b0a84572edac293e08d24/scripts/new-solr-updater.py#L268) and sends an update + commit to Solr every [100 updates, or 60 seconds](https://github.com/internetarchive/openlibrary/blob/0748d2ab0db7966fd82b0a84572edac293e08d24/scripts/new-solr-updater.py#L198) whichever occurs first.

Here's a useful solr command for checking how far behind solr-updater is:

```sh
curl "ol-home:7000/openlibrary.org/log/$(docker exec openlibrary_solr-next-updater_1 cat /solr-updater-data/solr-update.offset)?limit=1"
```

### Admin force Solr update endpoint

https://openlibrary.org/admin/solr

Check the current value of the key populated by this endpoint that the updater script checks:
https://openlibrary.org/admin/inspect/store?key=solr-force-update

**NOTE:** this key is currently overwritten each time the form is submitted, so it is possible the updater script won't get the values if there are sequential POSTs.

### Log locations:

* Solr updater script log: `/var/log/upstart/ol-solr-updater.log`
* Solr itself: `/var/log/tomcat6/catalina.out`

Here's a useful command for counting log output:

```sh
ssh -A ol-solr2
sudo bash
cat /var/log/tomcat6/catalina.2020-05-13.log | grep '^May' | cut -c1-24 | sed 's/:[0-9][0-9] //' | sort | uniq -c > tmp.txt
```
## Solr development

### Query Solr directly on dev instance
Go to http://localhost:8983/ to view the solr admin dashboard. You can experiment with raw queries by selecting the "openlibrary" core in the dropdown in the sidebar, and then clicking on query in the sidebar.

http://localhost:8080/search.json?q=OL54120W to see what is in solr now for any query.

### Making changes to solr config

If you are experimenting with making changes to core solr configuration, you will need to do the following to test your changes using the bash script instructions below. 

```sh
# Assume OL is running
docker compose up -d

# Make whatever changes

# Stop solr and remove its container and data
docker compose stop solr solr-updater
docker container rm openlibrary-solr-1 openlibrary-solr-updater-1
docker volume rm openlibrary_solr-data openlibrary_solr-updater-data

# Bring solr back up, and also run a full reindex -- now with your changes in place
docker compose up -d solr solr-updater
docker compose run --rm home bash -c 'make reindex-solr'
```

See also: [Docker Instructions](https://github.com/internetarchive/openlibrary/blob/master/docker/README.md)

### Adding a Field to Solr

#### 1. Edit the Managed Schema
The [managed-schema.xml](https://github.com/internetarchive/openlibrary/blob/master/conf/solr/conf/managed-schema.xml) needs to be updated to include the new field. For example, we can add a field named "record quality score."
Add a new field definition for "record quality score" with the desired data type (in this case, "pint" for integer).

For example: `<field name="record_quality_score" type="pint"/>`

#### 2. Modify the Python Code
The Python code responsible for indexing data into Solr needs to be updated to populate the "record_quality_score" field. This code is in [update_work.py](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/solr/update_work.py).

For example:
`add('record_quality_score', compute_record_quality(work, editions))`

Note: You likely should implement `compute_record_quality` in another file.

#### 3. Generate Types
`PYTHONPATH=$(PWD) python3 openlibrary/solr/types_generator.py` - run this and copy the output to `solr_types.py` to add the new field.

#### 4. Reindex Data
Once you have made the code changes, perform a full reindex to incorporate the new field.

#### Additional Considerations
- If you need to cross-reference data from external sources like archive.org or Wikidata, additional data retrieval steps may be required.
- Keep in mind that the order of fields in your Solr schema can affect search results. Be aware of the field ordering if it's relevant to your change.

See this video (https://archive.org/details/openlibrary-tour-2020/2022-01-10-openlibrary-adding-fields-to-solr-search-engine.mp4):

<a href="https://archive.org/details/openlibrary-tour-2020/2022-01-10-openlibrary-adding-fields-to-solr-search-engine.mp4"><img width="641" alt="Screenshot 2023-10-06 at 9 44 45 AM" src="https://github.com/internetarchive/openlibrary/assets/978325/75f8dbfd-45f8-4ada-8d69-f3aea8d54f84"></a>

## Creating a Solr Backup

Creates a `.tar.gz` file of the Solr index.

```sh
ssh -A ol-home

# 1. Stop solr-updater so that the index doesn't change while we make the backup
sudo supervisorctl stop solr-updater

ssh -A ol-solr2
tmux

# 2. Commit any pending docs
# check how many docs are pending
curl http://localhost:8983/solr/admin/stats.jsp | grep -A 2 Pending
# ** This didn't work earlier! It took 7+ minutes, so we just abandoned it **
curl http://localhost:8983/solr/update?commit=true

# 3. Create the backup (~35 min on 8 May 2019; ~13 GB)
ssh -A ol-home
cd /1/solr-backups
time ssh -A mek@ol-solr2 "sudo -uroot tar zcf - /var/lib/solr/data" > backup-$(date +%F).tar.gz

# 4. Restart Solr updater
ssh -A ol-home
sudo supervisorctl start solr-updater
```

# Docs from GIO - Updating the Search Engine (notes by: Anand Chitipothu)
Open Library uses Apache Solr for providing search functionality to the website. The Solr instance maintains its index of all the items to be search in its data directory. This index is informally called a “search index”. All book, work and author records are stored in the same search engine.

## Updating the Search Engine

Whenever a record is updated on Open Library, the corresponding entry in the search engine must be updated to get up-to-date results. Open Library has two different ways to update the search index:

### 1. The Manual Way
The openlibrary/solr module has the [update_work.py](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/solr/update_work.py) script for updating solr. Even though the script name is indicating only work, it can be used for updating even edition and author documents in solr.

To update a one or more entries manually:
WARNING: be sure to use the right openlibrary.yml file…

```sh
python openlibrary/update_work.py --config openlibrary.yml /books/OL123M /works/OL234W /authors/OL45A
```

By default, the script performs an commit to the Solr. Doing a commit ensures that the changes are flushed to the disk and available to search requests from now on. However, it is very expensive operation and takes more than 5 minutes (at the time of writing this).

To update the documents without out committing them, add `–nocommit` flag:

```sh
python openlibrary/update_work.py --config openlibrary.yml --nocommit /books/OL123M /works/OL234W /authors/OL45A
```

### 2. The Solr Updater
[scripts/solr_updater.py](https://github.com/internetarchive/openlibrary/blob/master/scripts/solr_updater.py), is run as a daemon process. It listens for edits to the database and updates the corresponding documents in Solr.

Infobase, the system that handles the all the modifications to the system, maintains a log of all changes. Each modification is written to a log as a JSON entry. It also provides an API to access the log entries.

The solr updater script uses this API to retrieve modifications update the corresponding documents in solr (the search engine).

While this looks like a fair approach, the solr updater script can fail due to a bad record or unexpected data. When this happen, the solr updater dies and resumes from the same point. As such, it can get stuck in an infinite loop.

The current position of the log file consumed by the solr updated is maintained in a state file. The state file will be at /var/run/openlibrary/solr-update.offset, or another path passed to the solr updater script.

## The Updating Process

To understand what is involved in updating a record in solr, lets restrict to work search and try to visualize a work record with bunch of editions.

The work record should appear in search results, when any one the following terms are used in the search query:

- title of the work
- title of any of its editions (could be in other languages)
- ISBN or any other ID of the editions
- name of the the authors
- (and some more)

To get all this information, the solr document needs information from the following sources:

- The work record from OL database
- All the edition records belonged to that work
- All the author records belonged to that work
- Data about all the records which have been marked as redirect to any of the above records
- IA metadata for each edition having a scan

Getting these individually is inefficient. Some efforts have been made to speed this up by:
1. batching requests
2. talking directly to the database (to avoid middle layer overhead)

Author records have a similar flow.

## Analyzing Queries

`/solr/#/openlibrary/analysis?analysis.fieldvalue=The%20Mar[…]tput=0&analysis.query=the%20mark%20of%20the%20crown`