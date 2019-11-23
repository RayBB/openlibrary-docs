

***
**Question:** What should I do to find the endpoints/files relating to the components I want to contribute to?

**Answer:** https://dev.openlibrary.org/developers/routes - can be found here

**Issue link:** For a full description see: https://github.com/internetarchive/openlibrary/issues/1865


***
**Question:** What should I do when book covers won't load locally?

**Answer:** This can be resolved by going to conf/openlibrary.yml and changing `coverstore_url` to https://covers.openlibrary.org

**Issue link:** For a full description see: https://github.com/internetarchive/openlibrary/issues/1897

***
**Question:** What should I do if I come across a bundle-size error (like the one below) while running `docker-compose exec web make test` to test? 
```
 FAIL static/build/page-plain.css: 18.81KB > maxSize 18.8KB (gzip)
```
**Answer:** Unless the extra CSS content is well justified, consider placing styles in an JavaScript entry point file e.g. `<file_name>--js.less` and load it inside `static/css/js-all.less` via `@import`. This CSS will only get loaded via JavaScript and has a much higher bundle size threshold, otherwise, bundle-sizes can be changed in `openlibrary/package.json`.

**Issue Link**: https://github.com/internetarchive/openlibrary/wiki/Frontend-Guide#beware-of-bundle-sizes
***
