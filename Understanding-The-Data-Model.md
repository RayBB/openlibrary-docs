# Infogami 
Each Infogami page (i.e. something with a URL) has an associated type. Each type contains a schema that states what fields can be used with it and what format those fields are in. Those are used to generate view and edit templates which can then be further customized as a particular type requires.

Infogami provides a generic way through it's wiki to create new types as needed. 

# Infogami Database Schema
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



Read further about Infogami and type on :

<https://openlibrary.org/dev/docs/infogami>

# Open Library Feature Tables

Open Library has a number of additional tables that are used to support a variety of features.  The DDL for these tables can be found [here](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/core/schema.sql).

![Screenshot from 2023-12-11 15-06-45](https://github.com/internetarchive/openlibrary/assets/28732543/c7d93bc9-936d-43eb-a31f-f57e2cb151c5)

## `bookshelves` and `bookshelves_books`

![reading-log](https://github.com/internetarchive/openlibrary/assets/28732543/f4d089cf-eed9-4c59-a8ac-e7cc71d09948)

These tables are used to store the books that patrons have on their "Want to Read", "Currently Reading", and "Already Read" reading log shelves.  The `bookshelves_books` table holds most of this data, with `bookshelves` acting as a look-up table for shelf names.

[`bookshelves.py`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/core/bookshelves.py) provides functions which interact with the reading log tables.

**Note:** The `bookshelves_votes` table currently exists in our schema, but is not used by Open Library.

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
