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