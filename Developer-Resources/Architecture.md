# Architecture of the Dev Instance

This page contains details on how the dev instance is designed, how the various pieces run and interact with each other.

## Index
* [Services](#services)
* How they interact
* How are they managed
* Logging
* Config files

## Services

### Web server 
lighttpd http server runs infogami through FastCGI interface using Flup. (There can be multiple concurrent infogami instances that the lighttpd server distributes requests between, although we currently just run one.)Infogami is written in Python (we currently require 2.5 or greater) and uses web.py and ThingDB. ThingDB uses PostgreSQL as its data store. Psycopg2 is the Python driver for PostgreSQL. We use supervise (see also daemontools) to make sure everything keeps running.

## CouchDB

At one point or another, we used couchdb. Note that this may no longer be a requirement.

On Linux, installing CouchDB involves installing so many dependencies, some of them are incompatible with ubuntu/debian installations. Fortunately, a binary distribution with all the binaries is provided by [CouchOne](http://www.couchone.com/get)

The problem with that distribution is that it is interactive and it won’t be possible to automate the installation of that. To overcome this problem, the binaries after running the interactive installation are taken and bundled. The ol install script, downloads the bundle, unpacks it and runs a script to updates the path in some scripts and config files.

The created bundle couchdb-1.0.1-linux-binaries.tgz is uploaded to [this link](http://www.archive.org/details/ol_vendor).

On Max OS X, installing couchdb is somewhat easier than installing on Linux. However to make the installations on both mac and linux similar, binaries are taken from [CouchDBX app](http://dl.couchone.com/dl/26f246a0fe23d6a53d532671330bf06d/CouchDBX-1.0.1.1.zip).

Unlike Linux, where bin and etc are available in the top-level, Mac binaries have them at 2 level deep. To make both distributions identical, a bin/couchdb script is added and etc is symlinked from couchdb_1.0.1/etc. Also the Mac couchdb script expects the base directory should be the working directory. The above bin/couchdb script, takes of this too.

### Templates 
The infogami application relies on various Web templates (these are code+html snippets). The initial templates are static files but they get edited through the wiki interface, and new ones get added through the wiki, so the real versions live entirely in the database.

### Search 
Infogami also accepts plug-ins and we use one for the Solr search engine. Solr is a JSP currently sitting in a Jetty http server, so it communicates with Infogami through a local http socket. Solr itself wraps the Lucene search library. These run under Java (we're currently using Java 1.5, I think). Solr is built under Apache Ant and has a few config and schema files, plus a startup script (solr.sh) that has to be manually edited to set the port number. I think we currently use Lucene as a downloaded .jar file so we don't build it.

### Search plugin 
The solr-infogami plugin also calls out to an archive.org PHP script that expands basic search queries to advanced queries. It may also start using the openlibrary.org flipbook (with some possible customizations) to display OCA scans for pages containing fulltext search results.

### Data 
We have a bunch of catalog data and fulltext acquired from various sources, either sitting in the Archive or to be uploaded to there. I think the acquisition processes (including web crawling scripts for some of the data) is outside the scope of an Open Library software install. There are a bunch of additional scripts to make the stuff usable in openlibrary and these need to be documented. These include TDB Conversion Scripts written by dbg, and (for OCA fulltext) Archive Spidering and Solr Importing scripts written by phr. 