# Front End Guide

## Working with JavaScript

### Introduction

The Open Library website makes heavy use of jQuery libraries. 

Except `jquery` and `jquery-ui`, all other third-party JavaScript libraries are combined and included as `vendor.js`.

All the custom JavaScripts are combined and includes as `all.js`.


### vendor.js and third party libraries

All third-party JavaScripts are added in the `vendor/js`_ directory in the  repository and `static/build/vendor.js` is generated by combining these  JavaScripts. The files included in `static/build/vendor.js` are specified in a shell script `static/js/vendor.jsh`.

To include a new third-party library:

* Add that library in [vendor/js](http://github.com/internetarchive/openlibrary/tree/master/vendor/js) in the repository
* Add an entry in [static/js/vendor.jsh](http://github.com/internetarchive/openlibrary/tree/master/static/upstream/js/vendor.jsh)
* Generate `vendor.js` by running `make`:
```        
$ make js
```
* Commit vendor.jsh and the library added to the repository

### all.js and custom JavaScripts

All the custom JavaScript files are put in the repo at `openlibrary/plugins/openlibrary/js`. All these JavaScript files are combined to generate `build/js/all.js`.

The order in which these files are included is determined by the sort order of the names. In general, it is a bad idea to depend on the order of files loaded.

If you make any changes to any of the JavaScript files, run `make js` to regenerate `build/js/all.js`.

## Working with CSS

All stylesheets are in `static/css`. They are combined to generate `build/css/all.css`, which is included in all the web pages.

It's a good idea to break CSS into multiple logical files, instead of putting it in one monolithic file.

If you make changes to any CSS, run `make css` to regenerate `build/css/all.css`.