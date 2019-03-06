**Question:** Travis CI build fails due to linting errors?

**Answer:** This can be solved by running `npm run lint:fix` inside the docker container.

**Issue link:** For a full description see: https://github.com/internetarchive/openlibrary/issues/1868

***
**Question:** What should I do to find the endpoints/files relating to the components I want to contribute to?

**Answer:** https://dev.openlibrary.org/developers/routes - can be found here

**Issue link:** For a full description see: https://github.com/internetarchive/openlibrary/issues/1865

***
**Question:** What should I do if I face a 404-page error on local / on openlibrary.org site?

**Answer:** Check out the answer for this here: https://github.com/internetarchive/openlibrary/issues/1864

***
**Question:** What should I do when book covers won't load locally?

**Answer:** This can be resolved by going to conf/openlibrary.yml and changing `coverstore_url` to https://covers.openlibrary.org

**Issue link:** For a full description see: https://github.com/internetarchive/openlibrary/issues/1897
***
**Question:** What should I do when I come across an internal error (like the one below) while running Open Library locally on Docker? 
```
"Sorry. There seems to be a problem with what you were just looking at. We've noted the error 2019-02-05/193353339339 and will look into it as soon as possible. Head for home?"
```
**Answer:** When you hit an error, if you add `?debug=true` to the url (if it's a GET), or (if it's a POST) inspect the form element and add `?debug=true` to the action url, you should see a useful stack trace.
***
**Question:** What should I do if I come across a bundle-size error (like the one below) while running `docker-compose exec web make test` to test? 
```
 FAIL static/build/page-plain.css: 18.81KB > maxSize 18.8KB (gzip)
```
**Answer:** Unless the extra CSS content is well justified, consider placing styles in an JavaScript entry point file e.g. `<file_name>--js.less` and load it inside `static/css/js-all.less` via `@import`. This CSS will only get loaded via JavaScript and has a much higher bundle size threshold, otherwise, bundle-sizes can be changed in `openlibrary/package.json`.

**Issue Link**: https://github.com/internetarchive/openlibrary/wiki/Frontend-Guide#beware-of-bundle-sizes
***



## Open Questions

