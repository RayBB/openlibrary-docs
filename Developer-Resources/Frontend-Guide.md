Welcome to the Front-End Guide for Open Library, a primer for making front-end changes to the openlibrary.org website.

## File organization

**assets**: css/less in /static/css and js in /openlibrary/plugins/openlibrary/js

**models**: `/openlibrary/core/` and `/openlibrary/plugins/upstream/models.py`, data + ORM

**controllers**: in `/openlibrary/plugins/` (maps urls [via regex] → classes w/ GET + POST functions which receive/serve content to clients)

**templates**: in `/openlibrary/templates` and `openlibrary/macros`. Macros are special template components because they can be rendered (by librarians + admins) as `{{macros()}}` in infogami wiki pages

## How does url routing work?

[Lookup the url pattern here](https://github.com/internetarchive/openlibrary/wiki/Endpoints#list-of-all-routes) or via https://dev.openlibrary.org/developers/routes to find out which view class is responsible for generating the template with which you wish to work. Some routes may pass through Open Library (to Infogami) and actually be handled generically by Infogami. This is true for routes like `/books/OL..M/:title` whose route patterns you can see registered at the bottom of `openlibrary/core/models.py`. You may note, most of the url routing is handled within [openlibrary/plugins](https://github.com/internetarchive/openlibrary/tree/master/openlibrary/plugins). Each view class specifies whether it returns json or if it returns a template. If it returns a template, the first argument should be the template's path (relative to the `templates/` directory) where it lives. The values following the template name are variables passed into the template (that the template will have access to). 

### How a Request is Processed by Open Library:
When a user submits a url, like https://openlibrary.org/home, the url is first checked by /openlibrary/core/processors/readableurls.py to see (a) if the url has to be re-written (e.g. did you know that http://openlibrary.org/b/OL10317216M is a valid url?) and (b) whether the url contains names which need to be translated from terms our patrons use (e.g. /books/OL...M) to the internal infogami type names registered in the database (e.g. /editions/OL...M).

From here, a distinction is made between pages which are custom defined by us (whose controllers live in /openlibrary/plugins) and pages which are managed by infogami (and whose controllers are implicitly defined -- i.e. there is no explicit controller in the code). In the case of /home, this is an endpoint we defined and has a controller defined in /openlibrary/plugins/openlibrary/home.py. This controller declares the url pattern it's responsible for (i.e. /home), fetches the data it needs from various models, and (where applicable) explicitly passes this data into a template (in this case, /openlibrary/templates/home/index.html). The controller then returns the rendered result of this template injected with data to the patron. This differs from the magical process by which urls are resolved for infogami pages.

### Infogami Types:
Open Library sits on top of a Wiki/CRM platform called Infogami which helps us define page types. By default, an infogami page (like https://openlibrary.org/about) is of /type/page. We've defined a bunch of other special page types (e.g. /type/page, /type/edition, /type/work, /type/author, /type/user -- see all of them here: https://openlibrary.org/type). Unlike endpoints we define (e.g. by registering controllers within /openlibrary/plugins), infogami has a generic engine which implicitly / invisibly defines controllers for all infogami pages. This engine intrinsically resolves pages of designed types directly to their corresponding templates, without there being any explicit controller represented in the code. This can sometimes make it really confusing when you're trying to figure out where the code is for a specific endpoint (spoiler: it probably only exists abstractly).

When you request a url (for an infogami page), /openlibrary/core/processors/readableurls.py again first maps the url to the correct underlying infogami type, the infogami engine generically fetches the requested page object (e.g. /about or /edition/OL...M) from the infogami database (infostore) and then passes it directly to the infogami template with the matching type as defined in /openlibrary/templates/type (e.g. edition, page, work, author, etc).
Re-iterated, infogami pages don't have different explicit controllers defined within the code -- urls which address infogami pages are caught by infogami, the matching db object is fetched by infogami and passed as generic variable called page into special infogami-specific templates which live in /openlibrary/templates/type/{type}/view.html via the line $def with (page). The corresponding properties and attributes of page are confusingly defined (according to the page's type) in /openlibrary/plugins/upstream/models.py

## Working with JavaScript

Open Library uses jQuery. Except `jquery` and `jquery-ui`, other third-party JavaScript libraries are combined and included as `vendor.js`. All the custom JavaScripts are combined and includes as `all.js`.

Most of the heavy application lifting is done by a file in `openlibrary/openlibrary/plugins/openlibrary/js/ol.js`

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

### Working in Docker

Refer to: https://github.com/internetarchive/openlibrary/blob/master/docker/README.md#code-updates

While running the oldev container, gunicorn is configured to auto-reload modified files. To see the effects of your changes in the running container, the following apply:

Editing python files or web templates => simply save the file, gunicorn will auto-reload it.
Working on frontend css or js => you must run docker-compose exec web make css js. This will re-generate the assets in the persistent ol-build volume mount, so the latest changes will be available between stopping / starting and removing web containers. Note, if you want to view the generated output you will need to attach to the container (docker-compose exec web bash) to examine the files in the volume, not in your local dir.
Adding or changing core dependencies => you will most likely need to rebuild both olbase and oldev images. This shouldn't happen too frequently. If you are making this sort of change, you will know exactly what you are doing

## Working with CSS

All stylesheets are in `static/css`. They are combined to generate `build/css/all.css`, which is included in all the web pages.

It's a good idea to break CSS into multiple logical files, instead of putting it in one monolithic file.

If you make changes to any CSS, run `make css` to regenerate `build/css/all.css`.

### Beware of bundle sizes

When adding CSS content, while testing you may face an error such as this for example:

```
 FAIL static/build/page-plain.css: 18.81KB > maxSize 18.8KB (gzip)
```
This is telling you that your changes have increased the amount of CSS loaded, more than the required amount. This can lead to performance degradation so note that it should be avoided wherever possible (or be well justified!).

These problems are especially a concern for [CSS files on the critical path](https://www.smashingmagazine.com/2015/08/understanding-critical-css/). Always consider placing styles in an JavaScript entrypoint file e.g. `<file_name>--js.less` and load it inside `static/css/js-all.less` via `@import`. This CSS will only get loaded via JavaScript and has a much higher bundlesize threshold.

## Working with HTML

Open Library uses templetor syntax in our HTML. See its documentation first: http://webpy.org/docs/0.3/templetor

Here are some quick/useful snippets:
```html
$# Rendering sanitized text vs. HTML; replace `$` with `$:` in any of the following statements
$cond(True, 'a < 3', '')
$# Renders as:
a &lt; 3
$:cond(True, '<li>x</li>', '')
$# Renders as:
<li>x</li>

$# Short if/else statement
$ show_foo = true
<span>Hello, $cond(show_foo, 'foo', 'bar')!</span>
$# Renders as:
<span>Hello, foo!</span>

$# Add commas to an integer
$commify(1000)
$# Renders as:
1,000

$# Rendering other macros/templates
$:macros.EditButtons(comment="")
$:render_template("lib/pagination", pagecount, pageindex, "/admin/loans?page=%(page)s")
```

### Internationalization (i18n)
Any text that will be visible to the user should be internationalized. Use the special `$_` function.
See the webpy templetor i18n docs as well: http://webpy.org/cookbook/i18n_support_in_template_file

Examples:

#### Simple string i18n

~80% of i18n falls into this category:
```html
<a title="$('Add this book to your Want to Read shelf')">$_('Want to Read')</a>
```

#### Singular/plural text
For when you want to render things like "1 edition" vs. "2 edition**s**".
```html
$ungettext("There is one person waiting for this book.", "There are %(n)s people waiting for this book.", wlsize, n=wlsize)
```

In the translation file, this would look like:

```po
#: borrow.html:114
#, python-format
msgid "There is one person waiting for this book."
msgid_plural "There are %(n)s people waiting for this book."
msgstr[0] "Une personne attend ce livre."
msgstr[1] "%(n)s personnes attendent ce livre."
```

#### HTML i18n
For when you want to render links inside text; you should try to avoid this where possible because it requires the translator to copy the HTML exactly—but sometimes you can't avoid it. Note you _should not_ split up the sentence; it might not make sense in other languages. (Note the `:` before the `_`! That's what makes it render raw HTML.)

```html
$:_('By saving a change to this wiki, you agree that your contribution is given freely to the world under <a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" title="This link to Creative Commons will open in a new window">CC0</a>. Yippee!')
```

This sentence however _can_ be represented without i18n-ing the HTML by using python template strings:

@cdrini TODO untested this will actually work

```html
$def cc0_link():
  <a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" title="$_('This link to Creative Commons will open in a new window')">$_('CC0')</a>

$:(_('By saving a change to this wiki, you agree that your contribution is given freely to the world under %s. Yippee!') % str(cc0_link()))
```