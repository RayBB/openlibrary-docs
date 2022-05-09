# Quick Start for OpenLibrary's developers

| **WARNING: This documentation is _very_ out of date and needs to be re-written. Most of it is wrong, but some of it is right. If you're getting started, you likely want to take a look at https://github.com/internetarchive/openlibrary/tree/master/docker#welcome-to-the-new-docker-based-open-library-development-environment instead. |
| -- |

## Table of Contents

- [Using the Open Library Website](#using-the-open-library-website)
    - [Logging In (As Admin)](#logging-in)
    - [Admin Interface](#admin-interface)
    - [Testing the site with different users](#creating-users)
    - [Lending & Borrowing](#lending-and-borrowing)
    - [Configuration](#configuration)
- [Importing Test Data](Loading-Production-Book-Data) (moved)
- [Frontend Developer's Guide](Frontend-Guide) (moved)
- [Backend Developer's Guide](#backend-guide)
    - [Memcache](#memcache)
    - [Log Files](#logs)
    - [Database](#database)
    - [reCAPTCHA v2](#recaptcha)
- [FAQs](#faqs)
- [Credits](#credits)

## Getting Up & Running
We use Docker at openlibrary. Follow the instructions on https://github.com/internetarchive/openlibrary/tree/master/docker#welcome-to-the-new-docker-based-open-library-development-environment first to get your local copy of Open Library up and running!.

## Basic Developer Commands

### start

We Use Docker at openlibrary. These are some of the basic commands, refer [here](https://github.com/internetarchive/openlibrary/tree/master/docker#welcome-to-the-new-docker-based-open-library-development-environment) for some more useful commands.

Starts all the OL services:

```bash
$ docker-compose up
```

Start a specific service: 

The following command starts the `solr` service in the detached mode 

```bash
$ docker-compose up --no-deps -d solr
```

Logs of the services can be found:

```bash
$ docker-compose logs web # replace "web" with any other service name to see that particular service's log
```

### shell

Start a bash shell inside the container:

```bash
$ docker-compose exec web bash # replace "web" with any other service name
```

### test

Runs all the tests

```bash
$ docker-compose run --rm home make test
```

## Using the local Open Library Website

<a name="logging-in"></a>
### Logging In

You can log into the Open Library instance as an admin 

```
Username: openlibrary@example.com
Password: admin123
```

<a name="admin-interface"></a>
### Admin Interface

For users with sufficient privileges, an admin interface is available at http://localhost:8080/admin.

<a name="creating-users"></a>
### Testing the site with different users

| **WARNING: This section is very out of date and needs to be re-written. |
| -- |

To view and test the site as a non-admin user:

1) Login to your local dev instance (http://localhost:8080) as the openlibrary@example.com admin user.
2) Enter the admin interface URL: http://localhost:8080/admin and select the `People` option (http://localhost:8080/admin/people)
3) Select the user `AccountBot` from the "Recent Accounts" table.
4) At the top of the user page (http://localhost:8080/admin/people/AccountBot) there will be two red buttons -- click on "login as this user".

You should now be logged in as a standard user, `AccountBot`, and will be able to make edits, but not delete items etc.

To add AccountBot to a specific usergroup, such as `librarians`:

As the admin user openlibrary@example.com;

1) Open the `librarians` usergroup page in edit mode: http://localhost:8080/usergroup/librarians?m=edit
2) Add `/people/AccountBot` in the first "Members" slot and save the page.

Now you should be able to login as AccountBot using the instructions above and operate as a librarian.

<a name="lending-and-borrowing"></a>
### Lending and Borrowing

| **WARNING: This section is very out of date and needs to be re-written. |
| -- |

These instructions are fairly specific to Internet Archive staff who are administrating the Open Library service and who have access to the production olsystem repository.

It essentially enables your local developer repository to behave as if it were actually openlibrary.org, and thus sync with and to openlibrary.org's loans:

To enable lending on localhost check [this](https://github.com/internetarchive/olsystem/blob/master/Readme.md#enabling-lending-on-localhost)

<a name="configuration"></a>
### Configuring

Various configuration options can be found in conf/openlibrary.yml

Add conf/openlibrary.yaml to .git/info/exclude so that any changes to the conf file do not show up as dirty on git.

**Book covers**

By default these might be triggering 404s. Point coverstore_url to https://covers.openlibrary.org/


Be sure to restart your dev instance after any configuration changes.

<a name="importing-test-data"></a>
## Importing Test Data

This section moved [here](Loading-Production-Book-Data).

<a name="frontend-guide"></a>
## Frontend Guide

This section moved [here](Frontend-Guide).

<a name="backend-guide"></a>
## Backend Guide

<a name="memcache"></a>
### Memcache

- Infobase queries get cached in memcache. In the dev instance, there is a single-node memcache instance that you can test by connecting to it:

```python
$ docker-compose run --rm home python
Python 2.7.6 (default, Mar 22 2014, 22:59:56)
[GCC 4.8.2] on linux2
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

```pyshell
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

- You should never work directly with the database, all the data are indeed managed by OpenLibrary through *infobase*, but, if you are brave and curious, here you can find some useful infos.

- The first thing you have to know is that OpenLibrary is based on a [triplestore](https://en.wikipedia.org/wiki/Triplestore) database running on *Postgres*.

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

Occasionally, new tables get added to Open Library database and some existing tables get altered. Scripts are provided to migrate the existing dev instances to new schema.

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

- Currently we use reCAPTCHA v2, which validates users based on the "I'm not a robot" checkbox. 

- To develop with reCAPTCHA v2 locally, for testing new user signups and edits that require a user to prove they are human, you will need to [sign up for a reCAPTCHA API key pair](https://www.google.com/recaptcha/admin#list) from Google Developers (Google account required): `https://developers.google.com/recaptcha/docs/display`

- On the *Manage your reCAPTCHA v2 API keys* page under *Register a new site* enter the following values:

| Key | Value |
| --- | --- |
| **Label**   | *Local OL dev* |
| **Domains** | *0.0.0.0* |

- All reCAPTCHA v2 API keys work for local testing, so you do not need to enter the actual OpenLibrary domain. For example, `0.0.0.0` will work for the purpose of local development:

- Once you have generated the keys, add them to your local `conf/openlibrary.yml` file by filling in the public and private keys under the `plugin_recaptcha` section.

- From within the Docker container, restart the Open Library service via `sudo systemctl restart ol-web`. You can simply run `docker-compose restart` as well for the same.

### Caching
The home page is cached by default. To clear the cache of any page in cache run the following command:
```
docker-compose restart memcached
```

## FAQs

**Question:** Why do I hit a 404-page on local when the page shows up on openlibrary.org site?
**Answer:** Check out the answer for this here: https://github.com/internetarchive/openlibrary/issues/1864


***
**Question:** What should I do to find the endpoints/files relating to the components I want to contribute to?

**Answer:** https://dev.openlibrary.org/developers/routes - can be found here

**Issue link:** For a full description see: https://github.com/internetarchive/openlibrary/issues/1865


***
**Question:** What should I do when book covers won't load locally?

**Answer:** This can be resolved by going to conf/openlibrary.yml and changing `coverstore_url` to https://covers.openlibrary.org

**Issue link:** For a full description see: https://github.com/internetarchive/openlibrary/issues/1897

## Credits
And special thanks

- [rajbot](https://github.com/rajbot)
- [gdamdam](https://github.com/gdamdam)
- [anandology](https://github.com/anandology)
- [bfalling](https://github.com/bfalling)
- [mekarpeles](https://github.com/mekarpeles)
- [salman-bhai](https://github.com/salman-bhai)
