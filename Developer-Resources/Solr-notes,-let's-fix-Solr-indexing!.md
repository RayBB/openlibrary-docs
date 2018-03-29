### Solr updater script
[Solr updater script](https://github.com/internetarchive/openlibrary/blob/master/scripts/new-solr-updater.py)

Which is [configured to run as a service](https://github.com/internetarchive/openlibrary/blob/master/conf/init/ol-solr-updater.conf)

Get the service status:
`sudo status ol-solr-updater`

### Expected behaviour and timings

Changes to the Solr index are _supposed_ to be visible on the live Open Library site after [about 15 minutes](https://github.com/internetarchive/openlibrary/blob/c4d877ee6410df6f70ab45718baebe52fdf366ba/openlibrary/templates/admin/solr.html#L21).

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