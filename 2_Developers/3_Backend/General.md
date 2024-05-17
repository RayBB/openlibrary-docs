
## Code Organization

* openlibrary/core - core openlibrary functionality, imported and used by www
* openlibrary/plugins - other models, controllers, and view helpers
* openlibrary/views - views for rendering web pages
* openlibrary/templates - all the templates used in the website
* openlibrary/macros - macros are like templates, but can be called from wikitext

## Architecture

### The Backend

OpenLibrary is developed on top of the Infogami wiki system, which is itself built on top of the web.py Python web framework and the Infobase database framework.

- [Overview of Backend Web Technologies](https://openlibrary.org/about/tech)

Once you've read the overview of OpenLibrary Backend technologies, it's highly encouraged you read the developer primer which explains how to use Infogami (and its database, Infobase).

- [Infogami Developer Tutorial](https://openlibrary.org/dev/docs/infogami)

If you want to dive into the source code for Infogami, see the [Infogami repo](https://github.com/internetarchive/infogami).



<a name="backend-guide"></a>
## Backend Guide

<a name="memcache"></a>
### Memcache

- Infobase queries get cached in memcache. In the dev instance, there is a single-node memcache instance that you can test by connecting to it:

```python
$ docker compose run --rm home python
Python 3.10.5 (main, Jun 23 2022, 17:14:57)
[Clang 13.1.6 (clang-1316.0.21.2.5)] on darwin
Type "help", "copyright", "credits" or "license" for more information.
>>> import yaml
>>> from openlibrary.utils import olmemcache
>>> with open('/openlibrary/conf/openlibrary-docker.yml') as in_file:
...     y = yaml.safe_load(in_file)
...
>>> mc = olmemcache.Client(y['memcache_servers'])
```

to **GET** the memcached entry:

```python
>>> mc.get('/authors/OL18319A')
'{"bio": {"type": "/type/text", "value": "Mark Twain, was an American author and humorist. Twain is noted for his novels Adventures of Huckleberry Finn (1884), which has been called \\"the Great American Novel\\", and The Adventures of Tom Sawyer (1876). He is extensively quoted. Twain was a friend to presidents, artists, industrialists, and European royalty. ([Source][1].)\\r\\n\\r\\n[1]:http://en.wikipedia.org/wiki/Mark_Twain"}, "photograph": "/static/files//697/OL2622189A_photograph_1212404607766697.jpg", "name": "Mark Twain", "marc": ["1 \\u001faTwain, Mark,\\u001fd1835-1910.\\u001e"], "alternate_names": ["Mark TWAIN", "M. Twain", "TWAIN", "Twain", "Twain, Mark (pseud)", "Twain, Mark (Spirit)", "Twain, Mark, 1835-1910", "Mark (Samuel L. Clemens) Twain", "Samuel Langhorne Clemens (Mark Twain)", "Samuel Langhorne Clemens", "mark twain "], "death_date": "21 April 1910", "wikipedia": "http://en.wikipedia.org/wiki/Mark_Twain", "created": {"type": "/type/datetime", "value": "2013-03-28T07:50:47.897206"}, "last_modified": {"type": "/type/datetime", "value": "2013-03-28T07:50:47.897206"}, "latest_revision": 1, "key": "/authors/OL18319A", "birth_date": "30 November 1835", "title": "(pseud)", "personal_name": "Mark Twain", "type": {"key": "/type/author"}, "revision": 1}'
```

to **DELETE** a memcached entry:

```python
>>> mc.delete('/authors/OL18319A')
```

- You can also find memcached items using the Internet Archive ID (import `memcache` instead of `olmemecache`):

```python
>>> import yaml
>>> import memcache
>>> with open('openlibrary.yml') as in_file:
...     y = yaml.safe_load(in_file)
...
>>> mc = memcache.Client(y['memcache_servers'])

>>> mc.get('ia.get_metadata-"houseofscorpion00farmrich"')
```

<a name="logs"></a>
### Logs

| **WARNING: This section is likely out of date and might need to be re-written. |
| -- |

- Logs for the upstart services will be in `/var/log/upstart/`.

- The app server logs will be in `/var/log/upstart/ol-web.log`.


<a name="database"></a>
### Database

- You should never work directly with the database, all the data are indeed managed by Open Library through *infobase*, but, if you are brave and curious, here you can find some useful info.

- The first thing you have to know is that Open Library is based on a [triplestore](https://en.wikipedia.org/wiki/Triplestore) database running on *Postgres*.

- To connect to the db run:

```bash
su postgres
psql openlibrary
```

- All the OL’s entities are stored as things in the `thing` table.

Every raw contains:

id | key | type | latest_revision | created | last_modified
---|-----|------|-----------------|---------|---------------

- It is useful identify the `id` of some particular types: `/type/author` `/type/work` `/type/edition` `/type/user`

```sql
openlibrary=# SELECT * FROM thing WHERE key='/type/author' OR key='/type/edition' OR key='/type/work' OR key='/type/user';
```

this query returns something like:

id       |      key      | type | latest_revision |          created           |       last_modified
---------|---------------|------|-----------------|----------------------------|----------------------------
17872418 | /type/work    |    1 |              14 | 2008-08-18 22:51:38.685066 | 2010-08-09 23:37:25.678493
22       | /type/user    |    1 |               5 | 2008-03-19 16:44:20.354477 | 2009-03-16 06:21:53.030443
52       | /type/edition |    1 |              33 | 2008-03-19 16:44:24.216334 | 2009-09-22 10:44:06.178888
58       | /type/author  |    1 |              11 | 2008-03-19 16:44:24.216334 | 2009-06-29 12:35:31.346997

- to count the **authors**:
```
openlibrary=# SELECT count(*) as count FROM thing WHERE type='58';
```

- to count the **works**:
```
openlibrary=# SELECT count(*) as count FROM thing WHERE type='17872418';
```

- to count the **editions**:

```
openlibrary=# SELECT count(*) as count FROM thing WHERE type='52';
```

- to count the **users**:
```
openlibrary=# SELECT count(*) as count FROM thing WHERE type='22';
```

<a name="recaptcha"></a>

## Database Migrations

| **WARNING: This section is very out of date and needs to be re-written. |
| -- |

Occasionally, new tables get added to the Open Library database and some existing tables get altered. Scripts are provided to migrate the existing dev instances to the new schema.

To migrate an existing dev instance:

```
$ python setup.py shell
$ python scripts/migrate_db.py
```

This will look at the current database schema, identify its version, and upgrade it to the latest version.

<a name="using-the-open-library-website"></a>

### Recaptcha


| **WARNING: This section is likely out of date and might need to be re-written. |
| -- |

- Currently, we use reCAPTCHA v2, which validates users based on the "I'm not a robot" checkbox. 

- To develop with reCAPTCHA v2 locally, for testing new user signups and edits that require a user to prove they are human, you will need to [sign up for a reCAPTCHA API key pair](https://www.google.com/recaptcha/admin#list) from Google Developers (Google account required): `https://developers.google.com/recaptcha/docs/display`

- On the *Manage your reCAPTCHA v2 API keys* page under *Register a new site* enter the following values:

| Key | Value |
| --- | --- |
| **Label**   | *Local OL dev* |
| **Domains** | *0.0.0.0* |

- All reCAPTCHA v2 API keys work for local testing, so you do not need to enter the actual OpenLibrary domain. For example, `0.0.0.0` will work for the purpose of local development:

- Once you have generated the keys, add them to your local `conf/openlibrary.yml` file by filling in the public and private keys under the `plugin_recaptcha` section.

- From within the Docker container, restart the Open Library service via `sudo systemctl restart ol-web`. You can simply run `docker compose restart` as well for the same.

### Caching
The home page is cached by default. To clear the cache of any page in cache run the following command:
```
docker compose restart memcached
```
