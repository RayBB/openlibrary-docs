## Adding new Tables

Interested in adding new table to our schema? Check out this reference PR: https://github.com/internetarchive/openlibrary/pull/7928/files

## Querying for Data

The [`bookshelves`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/core/bookshelves.py#L78-L90) core model shows us how we can use a database connection on the backend to query for data

```
from openlibrary.core import db
oldb = db.get_db() # i.e. web.database(**web.config.db_parameters)
query = "SELECT count(*) from bookshelves_books"
oldb.query(query)
```

### Fetching Things Individually or in Bulk

From within routers/controllers, it's much more common to use the `web.ctx.site` object to fetch individual or multiple records.


```
doc = web.ctx.site.get("/works/OL5285479W")
keys = ["/works/OL5285479W", "/works/OL257943W", "/works/OL27448W"]
docs = web.ctx.site.get_many(keys)
```

## Understanding Infogami, Infobase, and Web.py

Open Library is built using a wiki engine called [infogami](https://openlibrary.org/dev/docs/infogami) which sits on top of the
`web.py` python micro-web framework (comparable to flask). Web.py uses a variable called `web.ctx` to maintain the context of the application during/across a http request. Web.py also maintains a postgres database connection using `web.db`. Infogami extends and wraps the `web.db` controller by offering a system called `infobase` which behaves like an ORM (db wrapper) to allow us to define arbitrary data types like works, editions, authors, etc.

At the simplest level, Infobase works by relying on 2 tables: `things` and `data`:
* `things` gives every object in our system and ID, a type, and a reference to its data in the data table.
* `data` is just a massive catalog of json data that can be references by querying and joining things

Infogami injects a utility called `site` into web.py's `web.ctx` (https://webpy.org/cookbook/ctx) variable (ctx maintains information and connections specific to the current client). The `web.ctx.site` utility handles queries and joins for you so you can request and key from the things table, fetch all its corresponding data, and also leverage and models and functions we have defined for that thing's type.

# Infogami Database Schema

Every Infogami page on Open Library (i.e. something with a URL) has an associated type. Each type contains a schema that states what fields can be used with it and what format those fields are in. Those are used to generate view and edit templates which can then be further customized as a particular type requires. Infogami provides a generic way through it's wiki to create new types as needed. 

Aside from the tables listed [here](#open-library-feature-tables), Open Library in essence only really has **only two database tables**. By default they will have the same pretty basic functionality through Infogami

### Thing table
The thing table defines [types](https://openlibrary.org/dev/docs/infogami#anchor5) like editions, works authors, users, languages. The thing table also keeps track of instances of things by their identifiers it basically registers their IDs in the table as an instance.

Entries in a sample thing table 

id       |      key      | type | latest_revision |          created           |       last_modified
---------|---------------|------|-----------------|----------------------------|----------------------------
   2     | /type/key     |    1 |               1 | 2013-03-20 10:27:01.322813 | 2013-03-20 10:27:01.322813
   3     | /type/string  |    1 |               1 | 2013-03-20 10:27:01.322813 | 2013-03-20 10:27:01.322813
   4     | /type/text    |    1 |               1 | 2013-03-20 10:27:01.322813 | 2013-03-20 10:27:01.322813
   5     | /type/int     |    1 |               1 | 2013-03-20 10:27:01.322813 | 2013-03-20 10:27:01.322813

 
### Data table
The data table on the other hand maps one of these types to all of the data associated with it
Infogami provides a generic way through it's wiki to create new types as are needed

Entry in a sample data table

| thing_id 	| revision 	| data                                                                                                                                                                                                                                                                  	|
|----------	|----------	|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| 1        	| 1        	| {"created": {"type": "/type/datetime", "value": "2013-03-20T10:27:01.223351"}, "last_modified": {"type": "/type/datetime", " value": "2013-03-20T10:27:01.223351"}, "latest_revision": 1, "key": "/type/type", "type": {"key": "/type/type"}, "id": 1, "revision": 1} 	|



Read further about Infogami and type on: https://openlibrary.org/dev/docs/infogami

# Open Library Feature Tables

Open Library has a number of additional tables that are used to support a variety of features.  The DDL for these tables can be found [here](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/core/schema.sql).

![Screenshot from 2023-12-14 11-19-48](https://github.com/internetarchive/openlibrary/assets/28732543/9542a554-8d6c-4d78-ad7d-c41845ec9af8)

## `bookshelves` and `bookshelves_books`

![Screenshot from 2023-12-14 11-20-02](https://github.com/internetarchive/openlibrary/assets/28732543/2c9f654a-d926-4faf-9db0-499fcc0bf6ae)

These tables are used to store the books that patrons have on their "Want to Read", "Currently Reading", and "Already Read" reading log shelves.  The `bookshelves_books` table holds most of this data, with `bookshelves` acting as a look-up table for shelf names.

[`bookshelves.py`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/core/bookshelves.py) provides functions which interact with the reading log tables.

## `yearly_reading_goals`

![yearly_reading_goals](https://github.com/internetarchive/openlibrary/assets/28732543/51a29f03-25fd-4286-8423-23ae3c8dba1d)

This table stores the `target` number of books that a patron commits to reading in a given year.  Functions which interact with the `yearly_reading_goals` table can be found in [`yearly_reading_goals.py`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/core/yearly_reading_goals.py).

## `bookshelves_events`

![check_ins](https://github.com/internetarchive/openlibrary/assets/28732543/38fdd1e8-07ce-445b-9ca8-2621b54e00e3)

A patron can track the last date that they have finished any book that is on their "Already Read" shelf.  The `bookshelves_events` table stores these dates, and may later be used to store other dates that a patron may want to track (date they started reading the book, start and finish dates of other times that they have read a book, etc.).

Related code can be found in [`bookshelves_events.py`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/core/bookshelves_events.py).

## `observations`

![observations](https://github.com/internetarchive/openlibrary/assets/28732543/8a1fcfb1-30df-4f58-99f3-a0efb757b09a)

Patron's can give structured reviews of books by attaching any number of pre-defined tags to a work.  These are stored in the `observations` table.

The code that interacts with this table, as well as the definitions for the tags, are found in [`observations.py`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/core/observations.py).

## `booknotes`

![booknotes](https://github.com/internetarchive/openlibrary/assets/28732543/41986736-6fdc-4bb6-9bbf-1544fa4ff60e)

A patron can add private notes that only they can read to any work.  The `booknotes` table stores these notes.  [`booknotes.py`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/core/booknotes.py) contains the code that interacts with this table.

## `ratings`

![ratings](https://github.com/internetarchive/openlibrary/assets/28732543/9f9f000c-9cdc-4aa7-a022-bd4c1855266b)

Patrons can submit a star rating for a work.  The `ratings` table holds these star ratings.  Consult [`ratings.py`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/core/ratings.py) for related code.

## `community_edits_queue`

![merge_queue](https://github.com/internetarchive/openlibrary/assets/28732543/9dc1c072-176d-4f54-96b4-3b2ea582a744)

This table holds librarian requests, which in turn are used to populate the librarian request table at https://openlibrary.org/merges.  Code which interacts directly with thus table can be found in [`edits.py`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/core/edits.py).

