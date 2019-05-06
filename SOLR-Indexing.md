[Apache Solr](http://lucene.apache.org/solr/features.html) is used to power the search box, but is also used internally by the system and is intrinsic to the correct operation of the system. Some examples of places that it's used include:
* Enumerating the list of works for an author
* Enumerating the list of editions for a work
* Autocomplete by author name when editing a work and selecting authors
* Various "top" things like the top items to list in a carousel, an author's top work or subjects, etc.

Proper operation of the OpenLibrary Solr instance requires that it be updated when authors, works, and editions are edited or the search index will not correctly reflect the underlying database.

### Solr updater script
[Solr updater script](https://github.com/internetarchive/openlibrary/blob/master/scripts/new-solr-updater.py)

Which is configured to run as a service in production and a background process in the development 
[docker-compose environment](https://github.com/internetarchive/openlibrary/blob/cb167b78fac4199e57096009f1bbbdeb23ed4c72/docker/ol-docker-start.sh#L35).

To get the production solr-updater service status:
`sudo status ol-solr-updater`

### Expected behavior and timings

Changes to the Solr index are _supposed_ to be visible on the live Open Library site in no more than [about 15 minutes](https://github.com/internetarchive/openlibrary/blob/c4d877ee6410df6f70ab45718baebe52fdf366ba/openlibrary/templates/admin/solr.html#L21), but the latency depends on how far the Solr updater is behind in processing the database update queue.

The updater script looks for document changes in the Infobase logs at `http://<internal-infobase-url>/openlibrary.org/log` and has _(possibly incomplete)_ logic to update Solr accordingly.

The updater script checks for updates every [5 seconds](https://github.com/internetarchive/openlibrary/blob/0748d2ab0db7966fd82b0a84572edac293e08d24/scripts/new-solr-updater.py#L268) and sends an update + commit to Solr every [100 updates, or 60 seconds](https://github.com/internetarchive/openlibrary/blob/0748d2ab0db7966fd82b0a84572edac293e08d24/scripts/new-solr-updater.py#L198) whichever occurs first.


### Admin force Solr update endpoint

https://openlibrary.org/admin/solr

Check the current value of the key populated by this endpoint that the updater script checks:
https://openlibrary.org/admin/inspect/store?key=solr-force-update

**NOTE:** this key is currently overwritten each time the form is submitted, so it is possible the updater script won't get the values if there are sequential POSTs.

### Log locations:

* Solr updater script log: `/var/log/upstart/ol-solr-updater.log`
* Solr itself: `/var/log/tomcat6/catalina.out`

### Query Solr directly on dev instance
On host:
http://0.0.0.0:18983/solr/select?wt=json&json.nl=arrarr&q=key:/authors/OL18319A
Equivalent for Docker:
http://192.168.100.100:8983/solr/select?wt=json&json.nl=arrarr&q=key:/authors/OL18319A
where 192.168.100.100 is the IP address returned by `docker-machine ip` on OS X or Windows.