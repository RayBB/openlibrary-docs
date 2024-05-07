For programmatically bulk importing new books and authors into Open Library.

## Start here

Watch [this video](https://archive.org/details/openlibrary-tour-2020/ol_imports_comprehensive.mp4) about how Open Library import pipeline works. Staff should see [these import notes](https://docs.google.com/document/d/1KRtKYFEp40rgWlxWR1G3v60YSKIQBXbKQTjTloD0Vbg/edit). You may need a bot account, as described [here](https://github.com/internetarchive/openlibrary/wiki/Writing-Bots).

## The Import Pipeline

OpenLibrary.org offers several "Public Import API Endpoints" that can be used to submit book data for import, including one for MARC records, one for raw json book records (/api/import), and for directly importing against existing partner items (like archive.org) by ID (/api/import/ia).

Outside of these public API endpoints, Open Library also maintains a bulk batch import system for enqueueing json book data in bulk from book sources like betterworldbooks, amazon, and other trusted book providers (like librivox and standardebooks). These bulk batch imports ultimately submit records (in a systematic and rate-limited way) to the "Public Import API Endpoints", e.g. /api/import.

Once a record passes through our bulk batch import process and/or gets submitted to one of our "Public Import API Endpoints" (e.g. /api/import, see [code](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/importapi/code.py#L116)), the data is then parsed, augmented, and validated by the "Validator" in importapi/import_edition_builder.py.

Next the formatted, validated book_edition goes through the "Import Processor" called as catalog.add_book.load(book_edition). The function has 3 paths. It tries to find an existing matching edition and its work. The options are (1) no edition/work is found and the edition is created, (2) a matched edition is found no new data is available, (3) a matched record is modified with new available data.

In the case of (1) and (3), a final step is performed called "Perform Import / Update" whose description is in load_data(). Here is a flowchart of what the internal import pipeline looks like for a record that has been submitted to a public API:

### Import Pipeline Flowchart

<img src="https://user-images.githubusercontent.com/978325/216481234-7c185d46-f369-47d9-bb4e-7474897388e0.png" width="75%" height="75%">

## Bulk Import Options
The following resources are for developers doing bulk book record creation via our APIs. If you are a librarian and you want to add a new book catalog entry, refer to the guide on [Importing a Book Record Manually](#Import-Manually).
1. [Import by ISBN or ASIN](#Import-by-ISBN-or-ASIN)
2. [Import by MARC](#MARC-Records)
3. [Import by Archive.org Identifier](#Import-by-OCAID)
4. [Import by JSON](#Importing-JSON)
5. [Import by ONIX Feeds](Processing-ONIX-Feeds) (incomplete)
6. [Pipeline Internals](#Pipeline-Internals)

## Production Automatic Import Pipeline

For instructions and context on testing the Cron + ImportBot piplines, please see notes in [issue #5588](https://github.com/internetarchive/openlibrary/pull/5588) and [this overview video](https://archive.org/details/openlibrary-tour-2020/ol_imports_comprehensive.mp4) (bharat + mek)

Open Library's production automatic import pipeline consists of two components:

1. A Cron service with a collection of jobs which routinely pulls data from partner source and enqueues them in a database
2. An ImportBot which polls this unified database of queued import requests and process the imports them into the catalog  

**Note**: In the following chart, the [Infogami Container is detailed above in the main import flowchart](https://github.com/internetarchive/openlibrary/wiki/Developer's-Guide-to-Data-Importing#import-pipeline-flowchart) 
![viz-js com_](https://user-images.githubusercontent.com/978325/130883227-bce286f6-862a-419a-8e7d-6e214bfbe1b7.png)

From `openlibrary_cron-jobs_1` on `ol-home0` enqueue a batch:
```
cd /openlibrary/scripts
PYTHONPATH=/openlibrary python /openlibrary/scripts/manage-imports.py --config /olsystem/etc/openlibrary.yml add-new-scans 2021-07-28
```

Run import on an ID from `openlibrary_importbot_1` on ol-home0
```
cd /openlibrary/scripts
PYTHONPATH=/openlibrary python
```

```
import web
import infogami
from openlibrary import config
config.load_config('/olsystem/etc/openlibrary.yml')
config.setup_infobase_config('/olsystem/etc/infobase.yml')
importer = __import__("manage-imports")
import internetarchive as ia
item = importer.ImportItem.find_by_identifier('itinerariosporlo0000garc')
x = importer.ol_import_request(item, servername='https://openlibrary.org', require_marc=False)
```

## Procedure for Bulk Imports
1. Make sure your source data is archived and uploaded to https://archive.org/details/ol_data
2. Add/register your source to the https://openlibrary.org/dev/docs/data document
3. [Apply for a `bot` account](https://github.com/internetarchive/openlibrary/wiki/Writing-Bots) with API access
4. Create a new bot script for https://github.com/internetarchive/openlibrary-bots (each bot gets its own directory and contains a README so others in the future can see exactly how your data was imported)
4. Follow the [Bots Getting Started instructions](https://github.com/internetarchive/openlibrary/wiki/Writing-Bots#getting-started-rules) before running your bot.

## Historical Reference

Watch [this video by @hornc](https://archive.org/details/openlibrary-tour-2020/openlibrary-book-imports-2018.ogv) about the foundations of our import pipeline.

Here's a list of sourced we've historically imported. Many of the data sets themselves are archived within the `https://archive.org/details/ol_data` collection.
- https://openlibrary.org/dev/docs/data - a list of major sources we've imported
- https://openlibrary.org/about/help

## Import Code-Paths
There are multiple paths by which data can be imported into Open Library.

1. Through the website UI and the Open Library Client which both use the endpoint: https://openlibrary.org/books/add 
   * code: [openlibrary/plugins/upstream/addbook.py](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/upstream/addbook.py) 
   * tests: [openlibrary/plugins/upstream/tests/test_addbook.py](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/upstream/tests/test_addbook.py) although the current tests only cover the `TestSaveBookHelper` class, which is only used by the edit book pages, not addbook.
2. Through the [data import API](https://github.com/internetarchive/openlibrary/wiki/Endpoints#importing): https://openlibrary.org/api/import
    * code: [openlibrary/plugins/importapi/code.py](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/importapi/code.py)
3. By reference to archive.org items via the [IA import endpoint](https://github.com/internetarchive/openlibrary/wiki/Endpoints#importing): https://openlibrary.org/api/import/ia 
    * code: [openlibrary/plugins/importapi/code.py](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/importapi/code.py) which calls `openlibrary.catalog.add_book.load()` in [openlibrary/catalog/add_book/\_\_init\_\_.py](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/catalog/add_book/__init__.py)
 Checking for existing works and editions is performed here in `openlibrary.catalog.add_book.exit_early()`
    * Add book tests: [openlibrary/catalog/add_book/test_add_book.py](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/catalog/add_book/test_add_book.py)
4. Through our privileged ImportBot [scripts/manage_imports.py](https://github.com/internetarchive/openlibrary/blob/master/scripts/manage-imports.py)  which POSTs to the IA import API via `Openlibrary.import_ocaid()` from [openlibrary/api.py](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/api.py) 
3. Through bulk import API [openlibrary/api.py](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/api.py) -- this should be considered deprecated

# API Authentication for Imports

If you're trying to write a script which uses the import API endpoints on Open Library to import book data, your script will need to first perform authentication.

The manner of your app's authentication depends:
1. on what mechanism you're using (e.g. `curl`, `JavaScript`, `python`, etc.); and
2. whether you're importing into the production or the local development environment.

The API examples below assume you have followed the directions in this section to do whatever steps are necessary for authentication.

## JavaScript

If you're planning on using your browser's developer console or a bookmarklet to write import logic in javascript, authentication can be achieved by manually logging in to the website (e.g. openlibrary.org/account/login on production). This also works with localhost, testing, etc). If you open the developer tools console (by pressing `F12` on the keyboard) then, after logging in to the Open Library website, your JavaScript environment should be successfully setup and will use the session from the cookie in your browser.

Once you're browser is authenticated, proceed to the [JavaScript example: importing books from JSON](Developer's-Guide-to-Data-Importing#using-javascript)

## Python and `requests`

The only difference between production and development is the URL of the host: https://openlibrary.org for production, and http://localhost:8080 for development.

Using `requests.session`, it's possible to authenticate once, save the cookie, and use the same session object for multiple requests.

Note: this example uses the default credentials for the local development environment. If authenticating against production, you should *NOT* put your credentials in code you are going to commit somewhere. Instead, consider reading your credentials from the environment, a `.env` file, etc. There are many ways to do this, including [using docker compose to set environment variables](https://docs.docker.com/compose/environment-variables/set-environment-variables/) and [python-dotenv](https://pypi.org/project/python-dotenv/).
```python
# Get a logged in session
import requests
from urllib import parse
login_url = "http://localhost:8080/account/login"
login_headers = {'Content-Type': 'application/x-www-form-urlencoded'}
login_data = parse.urlencode({
    "username": "openlibrary@example.com",  # Do not store your real credentials in code you may commit.
    "password": "admin123",
})
session = requests.Session()
session.post(login_url, data=login_data, headers=login_headers)
```
At this point, you should be able to see your cookie in `session.cookies`:
```python
>>> session.cookies.get('session')
'/people/openlibrary%2C2024-03-21T05%3A03%3A00%2C10172%5a657abb15a5c469936ec86f420f7b39'
```
If you see a cookie corresponding your user, you can now use `session.post()` to `POST` to the appropriate API.

## openlibrary-client
See [openlibrary-client configuration](https://github.com/internetarchive/openlibrary-client?tab=readme-ov-file#configuration) for directions on how to install `openlibrary-client` and log in on both production and development.

Similar to plain `requests`, `olclient` will store your cookie in the `session` object to allow multiple authenticated requests using the same `session` object.

Follow the configuration directions on the openlibrary-client GitHub repository. Once you see your cookie in `ol.session.cookies`, you can use `ol.session.post()` to `POST` to the appropriate API.
```python
>>> ol.session.cookies.get("session")
'/people/openlibrary%2C2024-03-21T05%3A03%3A00%2C10172%5a657abb15a5c469936ec86f420f7b39'
```

## `curl`
Although `curl` lacks the concept of a session, it can store a cookie for later use.

This example is for the local development and uses the default credentials. You do not want to store your credentials in your shell history. [oh-my-zsh](https://ohmyz.sh/) users may wish to use the [dotenv](https://github.com/ohmyzsh/ohmyzsh/tree/master/plugins/dotenv) plugin.
```sh
curl -c cookies.txt -X POST "http://localhost:8080/account/login" -d "username=openlibrary@example.com&password=admin123"
```
`cookies.txt` should now have your session cookie within it:
```sh
❯ cat cookies.txt  
# Netscape HTTP Cookie File
# https://curl.se/docs/http-cookies.html
# This file was generated by libcurl! Edit at your own risk.

localhost       FALSE   /       FALSE   0       session /people/openlibrary%2C2024-03-21T05%3A03%3A00%2C10172%5a657abb15a5c469936ec86f420f7b39
localhost       FALSE   /       FALSE   0       pd
```
Once this is done, call `curl` with `-b cookies.txt` to use the cookie.

# Import APIs

## Import by ISBN or ASIN

### Individual ISBNs or ASINs
If you know the ISBN or ASIN of a book, you may be able to import it using the `https://openlibrary.org/isbn/:identifier:` API. Note: the ISBN must be convertible to ISBN 10 for this endpoint to work with an ISBN. This API walks through three steps:
1. First, the Open Library database is searched for the identifier in question, and if a match is found, that matched edition is returned;
2. If no matching edition is found, the `import_item` table will be checked for `staged` entries that match, an import will be attempted based on that match, and a new edition if any will be returned;
3. Finally, if no matches have been found yet, BookWorm (the "affiliate-server") will be queried for matches; if a match is found, the associated metadata is `staged` for import at a later date. At this step the server will simply reply that the page, `/isbn/<some isbn>`, does not exist. If `high_priority=true` is passed with the query to `/isbn` (e.g. (`/isbn/1234567890?high_priority=true`), then an import will be attempted and the resulting edition returned, if any.

### Submitting ISBNs in Bulk (not currently an option)

Ultimately, we'd like to create an ongoing ISBN import pipeline which discovers book isbns as they are published and imports their metadata into openlibrary.org. This requires 3 steps:

1. **Discovery** - writing bots to find isbns in web content such as catalogs and APIs 
2. **Submission** - uploading these isbns to https://archive.org/details/ol_data and processing them with @hornc's [`modern-import-bot`](https://github.com/internetarchive/openlibrary-bots/tree/master/modern-import-bot)
3. **Importing** - updating isbn import endpoints to prevent duplicating existing authors and importing undesirable content (like CDs)

improve a general purpose openlibrary.org endpoint which takes `isbn` (10, 13) and imports an item onto Open Library using our Amazon Affiliate API -- this includes logic to make sure only books (i.e. non-book items on amazon, like CDs) get imported and we avoid duplicating existing authors, works, and editions.

#### Discovering ISBNS 
We'll want to write bots to discover isbns in web content, such as catalogs and APIs. These bots will live in a dedicated repo called `openlibrary-bots` (https://github.com/internetarchive/openlibrary-bots). Each bot will have its own directory in the project with a README.md explaining how to run the bot to harvest isbns. I imagine the community will work on several bots (Amazon bots, Goodreads bots, Google Books bots, Better World Books bots, etc) which continuously look at sources at some regular interval to discover new isbns.

If we plan on creating a new bot, it's probably best practice to first *open an issue* on the `openlibrary-bots` repo explaining:
- what data source we plan on using
- what technology we’d like to use

For instance, let’s say we want to create a bot which discovers isbns from Amazon’s new arrivals:
1) You’d create an issue on https://github.com/internetarchive/openlibrary-bots/issues describing how it will work, what tech we will use, what the directory will be called
2) Once we get feedback, we’d create a directory in the project (e.g. amazon-new-arrivals-bot)
3) We’d add a README.md and a code a bot which discovers isbns
4) Create a new Archive.org item within the https://archive.org/details/ol_data collection named after your bot or data source, where your isbns will live (e.g. for our example `amazon-new-arrivals-bot` consider making a new item on Archive.org called `amazon-new-arrivals-isbns` within the `ol_data` collection). Add the url of this bot's archive.org item (where isbns will get uploaded/submitted) to the bot README. 
5) Add a few basic unit tests to ensure the software is working correctly (e.g. it works correctly against a static amazon page)

#### Submitting ISBNs in Bulk
Please do not run this list of isbns directly against our https://openlibrary.org/isbn/:isbn` API because it is highly rate-limited. Instead, @hornc is writing a [`modern-import-bot`](https://github.com/internetarchive/openlibrary-bots/tree/master/modern-import-bot) designed to take safely lists of isbns (from a specified archive.org item) and queue the isbns up to be safely imported into Open Library.

As a result, once your bot has collected a list of isbns for a certain time period, the first step is to upload the isbns to its Archive.org item (which should have been created in step #1 and named according to the bot which generated the isbns -- e.g. https://archive.org/details/amazon-new-arrivals-isbns` within the https://archive.org/details/ol_data collection) as `<date>_<source>_isbns.csv` -- e.g. `2019-06-25_amazon_isbns.csv`

#### Updating ISBN Import
In order for this entire process to work correctly and not produce bad data, we'll need to first make change to the isbn import endpoint to prevent duplication. For instance, to make sure only books (i.e. non-book items on amazon, like CDs) get imported and we avoid duplicating existing authors, works, and editions.

## Import by OCAID

### Background
`ocaid` stands for [Open Content Alliance Identifier](https://en.wikipedia.org/wiki/Open_Content_Alliance). The name was coined when Internet Archive and other groups institutions around the world worked together to create an ID system they could universally share for accessing books. Today, `ocaid` means the equivalent of Archive.org identifier. When you go to, e.g., https://archive.org/details/ol_data, `ol_data` is the `ocaid` / Archive.org identifier. This section deals with importing Archive.org book items (by their `ocaid` / Archive.org identifier) into Open Library.

### Ongoing Automatic Imports

Most qualifying Archive.org books are automatically imported into Open Library through a process calls **ImportBot**. [ImportBot](https://github.com/internetarchive/openlibrary/blob/master/scripts/manage-imports.py) is a script in the `scripts/` directory which is continuously run via a supervisorctl task on an internal machine called `ol-home`. The script makes a privileged call to [`core/ia.py`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/core/ia.py#L358) which queries Archive.org for books which meet import criteria (i.e. have a MARC record, have the right digitization `repub-state`, etc). The call to `core/ia.py`'s `get_candidate_ocaids` returns a list of `ocaids` which are batch-submitted using a queue to https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/importapi/code.py -- 
See #3 on [Import Code-Paths](#Import-Code-Paths) above.

### Direct Import by OCAID

If you are sufficiently privileged, you can import an Archive.org id into Open Library using the https://openlibrary.org/api/import/ia endpoint (which will require [authentication](Developer's-Guide-to-Data-Importing#api-authentication-for-imports)). This endpoint works both on production and in the local development environment, with the development endpoint being located at http://localhost:8080/api/import/ia.

The code for this endpoint is found within the `ia_importapi` class within [`openlibrary/plugins/importapi/code.py`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/importapi/code.py).

By default, the only required argument is `identifier`, which specifies the `ocaid`. The optional arguments include:
- `require_marc`: requires a [MARC record](#MARC-Records). Defaults to true.
- `force_import`: force the record to import. Defaults to false.

#### JavaScript import using `fetch`

Once you have [authenticated](Developer's-Guide-to-Data-Importing#api-authentication-for-imports) and logged into the relevant account on production/development via the web browser in which you're running the JavaScript, you can import an ocaid using the following recipe:

Note: for a production import, simply change the URL to `https://openlibrary.org/api/import/ia`.

First open your browser development tools (F12 key). Then to import [whitenightsother00dostiala](https://archive.org/details/whitenightsother00dostiala) for example:
```javascript
fetch("http://localhost:8080/api/import/ia?identifier=whitenightsother00dostiala", {
  method: 'POST',
})
.then(response => response.json())
.then(response => console.log(JSON.stringify(response)))
```

#### Python import using `requests`:
Note: this requires you to have an existing `requests.session` to use. See [API Authentication](#Python-and-requests) details.

Importing [whitenightsother00dostiala](https://archive.org/details/whitenightsother00dostiala) into the local development environment as an example:
```python
import_url = "http://localhost:8080/api/import/ia"
import_data = {
    "identifier": "whitenightsother00dostiala",
    "force_import": "false"
}
import_headers = {'Content-Type': 'application/json'}
response = session.post(import_url, data=import_data, headers=import_headers)
response.text  # Verify output
'{"success": true, "edition": {"key": "/books/OL20M", "status": "matched"}, "work": {"key": "/works/OL10W", "status": "matched"}}'
```

#### Using [openlibrary-client](https://github.com/internetarchive/openlibrary-client):
Note: this assumes you already have an authenticated session with `olclient`. See [API Authentication](#openlibrary-client) for details.
```python
import json
import_url = "http://localhost:8080/api/import/ia"
import_data = {
    "identifier": "whitenightsother00dostiala",
    "force_import": "false"
}
r = ol.session.post(import_url, data=import_data)
r.text  # Verify import
```

#### Shell import using `curl`:
Note: this requires your session cookie in `cookies.txt`. see [API Authentication](#curl) for details.

Importing [whitenightsother00dostiala](https://archive.org/details/whitenightsother00dostiala) as an example and finding it already exists in Open Library:
```sh
❯ curl -X POST "http://localhost:8080/api/import/ia" \ 
     -b cookies.txt \
     -d "identifier=whitenightsother00dostiala"

{"success": true, "edition": {"key": "/books/OL20M", "status": "matched"}, "work": {"key": "/works/OL10W", "status": "matched"}}
```

### Bulk Import by OCAID
Assuming you have API write access, you can use ImportBot's [`import_ocaids`](https://github.com/internetarchive/openlibrary/blob/master/scripts/manage-imports.py#L67) method directly to import a list of Archive.org items into Open Library by ocaid.

**NB** As of 2019-07, the ocaid import process is being revised by @charles to relax some outdated ocaid import constraints which are currently [preventing Open Library from importing tens of thousands of valid book items and their records](https://github.com/internetarchive/openlibrary/wiki/archive.org-%E2%86%94-Open-Library-synchronisation). e.g. right now MARC records and `repub-state`s are required, which we may want to relax. Also, we run into problems when Archive.org has multiple books for the same `isbn` (this causes a collision where a valid duplicate editions is rightfully caught by our duplication detector and prevented from being imported as a new edition). Ideally, perhaps, editions on Open Library would have multiple `ocaids`, but we're not there yet in our data model.

## Importing JSON

Sufficiently privileged patrons can POST JSON to production at https://openlibrary.org/api/import by following the [relevant schema](https://github.com/internetarchive/openlibrary-client/blob/master/olclient/schemata/import.schema.json). All developers can also POST the same JSON to their local development server at http://localhost:8080/api/import.

### Production Versus Development imports
As mentioned above, one can generally switch between importing to production and development by changing the URL from https://openlibrary.org/api/import to http://localhost:8080/api/import, but watch out for different usernames, passwords, sessions, etc.

### Using Javascript

If you are logged-in within the browser, you may use the following code to attempt an import:

```javascript
var bookdata = {'title': 'Ikigai', 'authors': [{'name': 'Souen, Chiemi'}, {'name': 'Kaneshiro, Flor'}], 'publish_date': '2021', 'source_records': ['amazon:195302114X'], 'number_of_pages': 40, 'publishers': ['Brandylane Publishers, Inc.'], 'isbn_10': ['195302114X'], 'isbn_13': ['9781953021144']}

fetch("https://openlibrary.org/api/import?debug=true", {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(bookdata)
}).then(response => response.json()) .then(response => console.log(JSON.stringify(response)))
```

#### Python import using `requests`:
Note: this requires you to have an existing `requests.session` to use. See [API Authentication](#Python-and-requests) details.

This is almost identical to POSTing with `openlibrary-client`, except `session` is not a method on `olclient`.

For more about the schema, see https://github.com/internetarchive/openlibrary-client/blob/master/olclient/schemata/import.schema.json
```python
import json
import_url = "http://localhost:8080/api/import"
import_data = {
    "title": "Beyond The Hundredth Meridian: John Wesley Powell And The Second Opening Of The West",
    "authors": [{"name": "Wallace Stegner"}],
    "isbn_13": ["9780803291287"],
    "languages": ["eng"],
    "publishers": ["University of Nebraska Press"],
    "publish_date": "1954",
    "source_records": ["amazon:B0016VINB0"],
}
r = session.post(import_url, data=json.dumps(data))
r.text  # Verify import
```

### Using [openlibrary-client](https://github.com/internetarchive/openlibrary-client):
Note: this assumes you already have an authenticated session with `olclient`. See [API Authentication](#openlibrary-client) for details.

This is almost identical to POSTing with `requests`, except here the `session` is a method of `olclient`.

For more about the schema, see https://github.com/internetarchive/openlibrary-client/blob/master/olclient/schemata/import.schema.json
```python
import json
import_url = "http://localhost:8080/api/import"
import_data = {
    "title": "Beyond The Hundredth Meridian: John Wesley Powell And The Second Opening Of The West",
    "authors": [{"name": "Wallace Stegner"}],
    "isbn_13": ["9780803291287"],
    "languages": ["eng"],
    "publishers": ["University of Nebraska Press"],
    "publish_date": "1954",
    "source_records": ["amazon:B0016VINB0"],
}
r = ol.session.post(import_url, data=json.dumps(data))
r.text  # Verify import
```

### Using `curl` (local development example):
This assumes you have a `cookies.txt` with your session cookie. See [API Authentication](#curl) for details.
```sh
❯ curl -X POST http://localhost:8080/api/import \
    -H "Content-Type: application/json" \
    -b cookies.txt \
    -d '{
    "title": "Super Great Book",
    "authors": [{"name": "Author McAuthor", "birth_date": "1806", "death_date": "1871"}],
    "isbn_10": ["1234567890"],
    "publishers": ["Burgess and Hill"],
    "source_records": ["amazon:123456790"],
    "subjects": ["Trees", "Peaches"],
    "description": "A book with a description",
    "publish_date": "1829"
}'
{"authors": [{"key": "/authors/OL15A", "name": "Author McAuthor", "status": "created"}], "success": true, "edition": {"key": "/books/OL19M", "status": "created"}, "work": {"key": "/works/OL9W", "status": "created"}}
```

## MARC Records

### Bulk MARC Import

We are in the process of expanding the `api/import/ia` endpoint functionality.

**From a conversation with @mek + @hornc**
We're going to write a `ImportBulkMarcIABot` in `openlibrary-bots`

1. For a given bulk archive.org item within ol_data collection, iterate over all its .mrc files.
2. For each .mrc file, retrieve the length of the first binary marc using the length (i.e. 1st) component of the LEADER field so we know when the first MARC records stops
e.g. http://www.archive.org/download/trent_test_marc/180221_ItemID_Test_001.mrc?range=0:5
3. We'll use ^ with the correct item + file to get the first MARC and then use the LEADER to process the rest
4. We'll take the MARC, call the MarcBinary code in `openlibrary/catalog/marc/marc_binary.py`
5. We'll have to exposed a new endpoint within `openlibrary/plugins/importapi/code.py` for MARC import (w/o IA book item) 
6. Add `"local_id": ["urn:trent:12345"]`key to openlibrary book metadata in addition to correctly formatted `source_record` so archive.org can search for the records using the OL books API from

### Importing Partner MARCs with Local ID Barcodes

**Cold Start:** If we’re creating an instance of Open Library service from scratch, before the following instructions, we’ll first need to create a new infogami `thing` called `local_ids` which is of type `page`. Next:

- A new partner named `foo` appears and their local_id barcode is in field `999$a` within their MARCs
- As an admin, navigate to https://openlibrary.org/local_ids/foo.yml?m=edit and set the following metadata. The following example presumes that `foo-archive-item` is the name of an archive.org item (preferably within the `archive.org/details/ol_data` collection) which contains one or more `.mrc` file(s). You can refer to https://openlibrary.org/local_ids/trent.yml for a live example.
```
id_location: 999$a
key: /local_ids/foo
name: Foo
source_ocaid: foo-archive-item
type:
    key: /type/local_id
urn_prefix: foo
```
- save, and you should be ready to start importing MARCs using the following instructions: https://github.com/internetarchive/openlibrary/wiki/Endpoints#import-by-archiveorg-reference

## Goals
Here is a list of generally expressed goals for importing:
* More imported books
* Quality imports
* Newer, more recent books
* More useful items, what are our users searching for and not finding?
* Ongoing, automated pipeline so OL stays (or becomes..) current
* Flexible, extensible import process that can import a wide range of available and new data sources
* Synchronisation with current and potential data partners (BWB, Wikidata, etc.)

These are high level areas. To make concrete progress we need to identify some specific goals, collect some data, identify tradeoffs, and prioritise between these categories, then break down into specific tasks.

## Metrics
In order to measure progress and gaps, we need some metrics...
### Basic starting point -- where are we?
* How many books are we currently importing now and over the recent past?
  * graph imports per month using `add_book` query?
  * Extra details:
     * Split by source, user added vs. bot added, MARC import, ISBN import
     * Distribution by published date for current imports and sources
* What is the current distribution of published dates in Open Library?
  * TASK: create a script to extract this data (for graphing) from a monthly ol_edition dump.
* What is being searched for and not found by users?
* Overlap stats with partner data (needs requirement details)

## Published dates in Open Library -- books with ISBN (14M out of 25M) @ July 2019
![Editions by publication year graph for July 2019](https://docs.google.com/spreadsheets/d/e/2PACX-1vRXTYkmE6wRV82Z-zJaCsPAJ91SBIEWOyCaPCK1U89c379_Ing4RReHsnTX_0JiShyDnySLgjd5ejKN/pubchart?oid=723822477&format=image)

## Sources of import metadata
* Libraries, MARC data
  * PROs:
    * Better metadata
    * More detail
    * Author distinction with dates
  * CONs:
    * Tend to be older books... primarily because we are not actively seeking new dumps? SFPL was the most recently extracted catalog imported (https://archive.org/details/marc_openlibraries_sanfranciscopubliclibrary).
* Booksellers, ISBN lookup
  * PROs
    * Newer books, incentive to keep up, market driven, popular modern books emphasised.
  * CONs
    * Lighter metadata
    * Frequently include notebooks and other products with ISBNs for sale that we might want to exclude
    * Frequently include non-book products with other identifiers (or incorrectly converted data in ISBN field) in their catalogs
    * Bookseller catalogs are not concerned with overall catalog coherence or quality -- maximising sales goal not impacted by junk metadata entries. Offer it for sale even if it does not make sense. We OTOH want _ALL_ items to be coherent.

IDEA: Define a bookseller metadata quality threshold. Heuristics to decide whether we want to import a record?

## Quality issues
* Duplicate records (Author, Work, Edition)
* Conflated records
* Junk records
  * non-book items
  * other non-record items the are generated due to errors
* Corrupt data
  * Unicode conversion
  * Dates, names, ISBN10 -> 13 conversion etc.
  * Misaligned metadata (good values in incorrect fields, multiple values in one field etc.)
  * Mismatched identifiers contribute to conflation issues

## Current state
_.. notes written, pending .._

## Other issues related to importing
* Add book UI
  * Consolidate add_book endpoints
  * UI add book should use and leverage the import API checks and available fields for consistency and code maintainability
  * https://github.com/internetarchive/openlibrary/issues/1163
## Related resources
* Current [project board for import pipeline efforts](https://github.com/internetarchive/openlibrary/projects/16)
* https://github.com/internetarchive/openlibrary/wiki/Developer's-Guide-to-Data-Importing
* https://github.com/internetarchive/openlibrary/wiki/Endpoints#importing
* https://github.com/internetarchive/openlibrary/wiki/Data-Source-Overview
* https://github.com/internetarchive/openlibrary-bots/tree/master/modern-import-bot
### Historical -- we likely want to resume the intent of these efforts:
* https://openlibrary.org/dev/docs/data
* https://openlibrary.org/about/help
* https://openlibrary.org/about/requirements

# Unified Import System

How we'd like an unified import system to behave:

1. We have a single cron container on ol-home0 which queries for, or fetches, data from sources (archive.org, partners / nytimes / openstax / bwb) and submit either archive.org IDs or json book records to a queue managed by scripts/manage-imports.py
2. A service container on ol-home `ImportBot` continuously listens for new batches and imports them into Open Library.

## Challenges

1. manage-imports.py currently only works on archive.org IDs (imports IA items) rather than on json data.
2. When we fetch a day of changes from Archive.org during our daily cron-check, it's easy for us to submit a batch to the `ImportBot` service. But when we fetch large volumes of monthly partner data which has millions of records, it's unclear how we should batch this and submit it to the `ImportBot` and how to know which [batches] are failing or succeeding. Do we submit 5000 batches of 1000 (e.g. 5M)?
3. `import_item` table only supports archive_id right now, what if it supported `data` as an alternative column and what would happen if this table had hundreds of millions of records.

## IA Import Bot

Video walkthrough here: (how OL Imports work) https://archive.org/details/openlibrary-tour-2020/ol_imports_comprehensive.mp4
See code: https://github.com/internetarchive/openlibrary/blob/master/openlibrary/core/ia.py#L313-L399

* There is a thing called the ImportBot daemon. It runs 24/7 checking the ImportQueue for new batches of ~1,000 records. These batches can include ia or any number of partner records.
* There's also a cron job (i.e. a timed linux job) which runs IA Imports once a day. This cron job calls the code above (i.e. get_candidate_ocaids) to fetch archive.org IDs (i.e. ocaids) and submits them to the ImportQueueto be processed by [1]

## Overview of Known Data Sources

*Penguin Books*
https://developer.penguinrandomhouse.com/docs/read/enhanced_prh_api

*Google Books*
https://developers.google.com/books/docs/v1/getting_started

*OCLC Worldcat Book Lookup*
https://platform.worldcat.org/api-explorer/apis/Classify/ClassificationResource/Search

*Simon and Schuster*
http://www.simonandschuster.biz/c/biz-seasonal-catalogs
https://catalog.simonandschuster.com/?cid=16322

*Library of Congress*
25M MARCs
https://www.loc.gov/cds/products/MDSConnect-books_all.html

*Hathi Trust*
16.8M volumes, 8M book titles, 38% public domain
https://www.hathitrust.org/bib_api

*Wikidata*
lookup any identifier (author, subject, language,...) and find other identifiers for the same entity
https://www.wikidata.org/
