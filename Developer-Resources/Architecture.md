# Architecture of the Dev Instance

This page contains details on how the dev instance is designed, how the various pieces run and interact with each other.

## Index
* [Services used](#services-used)
* How they interact
* How are they managed
* Logging
* Config files

## Services used

### Web server 
lighttpd http server runs infogami through FastCGI interface using Flup. (There can be multiple concurrent infogami instances that the lighttpd server distributes requests between, although we currently just run one.)Infogami is written in Python (we currently require 2.5 or greater) and uses web.py and ThingDB. ThingDB uses PostgreSQL as its data store. Psycopg2 is the Python driver for PostgreSQL. We use supervise (see also daemontools) to make sure everything keeps running.

### Templates 
The infogami application relies on various Web templates (these are code+html snippets). The initial templates are static files but they get edited through the wiki interface, and new ones get added through the wiki, so the real versions live entirely in the database.

### Search 
Infogami also accepts plug-ins and we use one for the Solr search engine. Solr is a JSP currently sitting in a Jetty http server, so it communicates with Infogami through a local http socket. Solr itself wraps the Lucene search library. These run under Java (we're currently using Java 1.5, I think). Solr is built under Apache Ant and has a few config and schema files, plus a startup script (solr.sh) that has to be manually edited to set the port number. I think we currently use Lucene as a downloaded .jar file so we don't build it.

### Search plugin 
The solr-infogami plugin also calls out to an archive.org PHP script that expands basic search queries to advanced queries. It may also start using the openlibrary.org flipbook (with some possible customizations) to display OCA scans for pages containing fulltext search results.

### Data 
We have a bunch of catalog data and fulltext acquired from various sources, either sitting in the Archive or to be uploaded to there. I think the acquisition processes (including web crawling scripts for some of the data) is outside the scope of an Open Library software install. There are a bunch of additional scripts to make the stuff usable in openlibrary and these need to be documented. These include TDB Conversion Scripts written by dbg, and (for OCA fulltext) Archive Spidering and Solr Importing scripts written by phr. 