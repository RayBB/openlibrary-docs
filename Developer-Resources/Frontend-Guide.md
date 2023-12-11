Welcome to the Front-End Guide for Open Library, a primer for making front-end changes to the openlibrary.org website.
 
- [File Organization Overview](#File-Organization-Overview)
- [CSS & HTML](#css-js-and-html)
  - [Building CSS & JS](#building-css-and-js)
  - [Working with CSS](#working-with-css)
  - [Working with HTML Templates](#working-with-html)
- [Working with Javascript](Javascript)
- [Overview of HTTP Endpoints](Endpoints)  
- [Routing & Templates](#routing-and-templates)
- [URL Routing](#url-routing)
- [The Lifecycle of a Network Request](#The-Lifecycle-of-a-Network-Request)
- [Infogami Types](#infogami-types)
- [Design Pattern Library](Design-Pattern-Library) (outdated) 

## File Organization Overview

- **assets**: css/less in /static/css and js in /openlibrary/plugins/openlibrary/js
- **models**: `/openlibrary/core/` and `/openlibrary/plugins/upstream/models.py`, data + ORM
- **controllers**: in `/openlibrary/plugins/` (maps urls [via regex] → classes w/ GET + POST functions which receive/serve content to clients)
- **templates**: in `/openlibrary/templates` and `openlibrary/macros`. Macros are special template components because they can be rendered (by librarians + admins) as `{{macros()}}` in infogami wiki pages

## CSS, JS, and HTML

<a name="building-css-and-js"></a>
### Building CSS and JS

During local development, after making edits to CSS or JS, one must re-compile the build/static assets. There three ways to do this.

#### One-off build of JS, CSS, and Vue components
- `docker compose run --rm home npm run build-assets`

#### One-off build each time a change is made
- JS: `docker compose run --rm home make js`
- CSS: `docker compose run --rm home make css`

#### Use a watch script to monitor for changes and build as necessary
- JS `docker compose run --rm home npm run-script watch`
- CSS `docker compose run --rm home npm run-script watch-css`
- Vue `docker-compose run --rm home npx vue-cli-service build --watch --no-clean --mode production --dest static/build/components/production --target wc --name ol-CoversNew openlibrary/components/CoversNew.vue`. Replace **CoversNew** with your component.

**Note**:
- You might also need to restart the webserver and/or clear browser caches to see the changes.
- If you want to view the generated files you will need to attach to the container (`docker compose exec web bash`) to examine the files in `./static` the Docker volume, rather than in your local directory.

### Working with CSS

All stylesheets are in `static/css`. They are combined to generate `build/css/all.css`, which is included in all the web pages.

It's a good idea to break CSS into multiple logical files, instead of putting it in one monolithic file.

If you make changes to any CSS, see [Building CSS and JS](#building-css-and-js) to regenerate `build/css/all.css`.

We are transitioning towards using [BEM notation](http://getbem.com/) for CSS classes. Please bear this in mind when contributing to our codebase and providing new classes or modifying existing classes. This simplifies our CSS and makes it easier to manage.

### Working with HTML

While running the oldev Docker container, gunicorn is configured to auto-reload modified Python files or web templates upon file save.

**Note**: the home page (`openlibrary\templates\home`) is cached and each change will take time to apply unless you run `docker compose restart memcached`, which restarts the `memecached` container and renders the change directly. 

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

$# Rendering other macros/templates
$:macros.EditButtons(comment="")
$:render_template("lib/pagination", pagecount, pageindex, "/admin/loans?page=%(page)s")
```

### Working with JavaScript

Most javascript files for the Open Library project live in openlibrary/openlibrary/plugins/openlibrary/js. Most of the heavy application lifting is done by `ol.js`. All the custom JavaScripts are combined and includes as `all.js`.

Open Library uses jQuery and Vue. Some third-party JavaScript libraries are combined and included as `vendor.js`. 

#### Adding New Javascript Files to HTML Templates

A guide by Jaye R.

In this tutorial, I'll walk you through how to hook up a Javascript file to an HTML template in the Open Library code base. I will use my experience working on the 'Meet the Team' page on Open Library as an example.

##### Step 1: Set up your environment

This tutorial assumes you already have an HTML template and a route created to display it on your browser. Go ahead and run the docker commands to pull up a local instance of the page -- we'll use it later.

##### Step 2: Find where the Javascript files live in the Open Library code

All the Javascript files can be found in a [`js` folder](https://github.com/internetarchive/openlibrary/tree/master/openlibrary/plugins/openlibrary/js). The path to that folder is `openlibrary/plugins/openlibrary/js`.

##### Step 3: Create a Javascript file

Inside the `js folder`, create a new Javascript file. Name it something meaningful -- what will this Javascript be doing? What page is it attached to?

    Ex: team.js

We'll come back to this file in a couple of steps. Next, let's take a closer look at the path the Javascript takes.

##### Step 4: Look at the `index.js` file

This file is the gateway for the Javascript files on Open Library. If you scroll down, somewhere around line 68 is a comment that says `// Initialize some things` and beneath it is a line that says `jQuery`. The code block after it has a bunch of `if statements`. Those `if statements` are what we use to tell the HTML templates to load a Javascript file. A good example to look at is around line 490.

```
    // Add functionality for librarian merge request table:
    const librarianQueue = document.querySelector('.librarian-queue-wrapper')

    if (librarianQueue) {
        import(/* webpackChunkName: "merge-request-table" */'./merge-request-table')
            .then(module => {
                if (librarianQueue) {
                    module.initLibrarianQueue(librarianQueue)
                }
            })
    }
```

Let's break this code down. In the first line, we are using DOM manipulation to grab an item from the HTML with a class of `librarian-queue-wrapper` and storing it in a variable called `librarianQueue`. Next, we check if that item exists on the DOM with an `if statement`. If it exists, we want to import the Javascript file associated with `librarianQueue`, which is located at `'./merge-request-table'`.

Underneath the import statement, we have another `if statement` and finally, a function from the Javascript file to initialize the librarian queue. If you want, check out the `merge-request-table` folder to see what the functions do. Otherwise, we'll continue setting up our own Javascript in the next step.

##### Step 5: Create the link in the `index.js`

We're going to do the same thing as the `librarianQueue` for the team page. There's a `div` on the team page template where the filtered cards will go -- I'll grab and use that in the `if statement`. If the `div` exists, import the Javascript on the `team` file we made earlier. Note that it's the location of the `team` file, not just the name.

```
    // Add functionality to the team page for filtering members:
    const teamCards = document.querySelector('.teamCards_container')

    if (teamCards) {
        import('./team')
            .then(module => {
                if (teamCards) {
                    module.initTeamFilter()
                }
            })
    }
```

We haven't actually made the `initTeamFilter` function yet, so let's do that in the next step.

##### Step 6: Create the `initTeamFilter` function in `team.js`

This function will contain all of the Javascript the HTML template needs.

```
    export function initTeamFilter() {
        console.log("Hooked up")
    }
```

And that's it! When you build the Javascript with `docker compose run --rm home make js`, or with the watch script `docker compose run --rm home npm run-script watch`,
and reload the HTML template in the browser you should see "Hooked up" in the console.

#### vendor.js and third party libraries

All third-party JavaScripts are added in the `vendor/js`_ directory in the repository and `static/build/vendor.js` is generated by combining these  JavaScripts. The files included in `static/build/vendor.js` are specified in a shell script `static/js/vendor.jsh`.

To include a new third-party library:

* Add that library in [vendor/js](http://github.com/internetarchive/openlibrary/tree/master/vendor/js) in the repository
* Add an entry in [static/js/vendor.jsh](http://github.com/internetarchive/openlibrary/tree/master/static/upstream/js/vendor.jsh)
* Generate `vendor.js` by running `make`:
```        
$ make js
```
* Commit vendor.jsh and the library added to the repository

#### all.js and custom JavaScripts

All the custom JavaScript files are put in the repo at `openlibrary/plugins/openlibrary/js`. All these JavaScript files are combined to generate `build/js/all.js`.

The order in which these files are included is determined by the sort order of the names. In general, it is a bad idea to depend on the order of files loaded.

If you make any changes to any of the JavaScript files, see [Building CSS and JS](#building-css-and-js) to regenerate `build/js/all.js`.

<a name="routing-and-templates"></a>
## Routing and Templates

- OpenLibrary is rendered using [Templetor](http://webpy.org/docs/0.3/templetor) templates, part of the [web.py](http://webpy.org/) framework.

- The repository you cloned on your local machine is mounted at /openlibrary in docker. If you make template changes to files locally, the OpenLibrary instance in the virtual machine should automatically pick up those changes.

- The home page is rendered by [templates/home/index.html](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/home/index.html), and its controller is [plugins/openlibrary/home.py](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/openlibrary/home.py#L18).

- A books page is rendered by [templates/type/edition/view.html](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/type/edition/view.html). An edition is defined by edition type. An edition is served by a `/books/OL\d+M` url.

- A works page is rendered by [templates/type/work/view.html](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/type/work/view.html). A work is defined by work type. A work is served by a `/works/OL\d+W` url.

## URL Routing

Are you trying to find an existing Router within our `plugins/`? You can try to [lookup the url pattern here](https://github.com/internetarchive/openlibrary/wiki/Endpoints#list-of-all-routes) or via https://dev.openlibrary.org/developers/routes to find out which view class is responsible for generating the template with which you wish to work. Some routes may pass through Open Library (to Infogami) and actually be handled generically by Infogami. This is true for routes like `/books/OL..M/:title` whose route patterns you can see registered at the bottom of `openlibrary/core/models.py`. You may note, most of the url routing is handled within [openlibrary/plugins](https://github.com/internetarchive/openlibrary/tree/master/openlibrary/plugins). Each view class specifies whether it returns json or if it returns a template. If it returns a template, the first argument should be the template's path (relative to the `templates/` directory) where it lives. The values following the template name are variables passed into the template (that the template will have access to). 

## The Lifecycle of a Network Request 

Here's how a network request from a patron flows through the Open Library application: When a user submits a url, like https://openlibrary.org/home, the url is first checked by /openlibrary/core/processors/readableurls.py to see (a) if the url has to be re-written (e.g. did you know that http://openlibrary.org/b/OL10317216M is a valid url?) and (b) whether the url contains names which need to be translated from terms our patrons use (e.g. /books/OL...M) to the internal infogami type names registered in the database (e.g. /editions/OL...M).

From here, a distinction is made between pages which are custom defined by us (whose controllers live in /openlibrary/plugins) and pages which are managed by infogami (and whose controllers are implicitly defined -- i.e. there is no explicit controller in the code). In the case of /home, this is an endpoint we defined and has a controller defined in /openlibrary/plugins/openlibrary/home.py. This controller declares the url pattern it's responsible for (i.e. /home), fetches the data it needs from various models, and (where applicable) explicitly passes this data into a template (in this case, /openlibrary/templates/home/index.html). The controller then returns the rendered result of this template injected with data to the patron. This differs from the magical process by which urls are resolved for infogami pages.

## Adding a new Router

To add a new Router to Open Library, refer to the tutorial in our [plugins README](https://github.com/internetarchive/openlibrary/tree/master/openlibrary/plugins/README.md).

## Infogami Types

Open Library sits on top of a Wiki/CRM platform called Infogami which helps us define page types. By default, an infogami page (like https://openlibrary.org/about) is of /type/page. We've defined a bunch of other special page types (e.g. /type/page, /type/edition, /type/work, /type/author, /type/user -- see all of them here: https://openlibrary.org/type). Unlike endpoints we define (e.g. by registering controllers within /openlibrary/plugins), infogami has a generic engine which implicitly / invisibly defines controllers for all infogami pages. This engine intrinsically resolves pages of designed types directly to their corresponding templates, without there being any explicit controller represented in the code. This can sometimes make it really confusing when you're trying to figure out where the code is for a specific endpoint (spoiler: it probably only exists abstractly).

When you request a url (for an infogami page), /openlibrary/core/processors/readableurls.py again first maps the url to the correct underlying infogami type, the infogami engine generically fetches the requested page object (e.g. /about or /edition/OL...M) from the infogami database (infostore) and then passes it directly to the infogami template with the matching type as defined in /openlibrary/templates/type (e.g. edition, page, work, author, etc).
Re-iterated, infogami pages don't have different explicit controllers defined within the code -- urls which address infogami pages are caught by infogami, the matching db object is fetched by infogami and passed as generic variable called page into special infogami-specific templates which live in /openlibrary/templates/type/{type}/view.html via the line $def with (page). The corresponding properties and attributes of page are confusingly defined (according to the page's type) in /openlibrary/plugins/upstream/models.py

### Working in Docker

Refer to: https://github.com/internetarchive/openlibrary/blob/master/docker/README.md

While running the oldev container, gunicorn is configured to auto-reload modified files. To see the effects of your changes in the running container, the following apply:

* Editing python files or web templates: see [Working with HTML](#working-with-html).
* Working on frontend CSS or JS: see [Building CSS and JS](#building-css-and-js).
* Adding or changing core dependencies => you will most likely need to rebuild both olbase and oldev images. This shouldn't happen too frequently. If you are making this sort of change, you will know exactly what you are doing.

### Beware of bundle sizes

When adding CSS content, while testing you may face an error such as this for example:

```
 FAIL static/build/page-plain.css: 18.81KB > maxSize 18.8KB (gzip)
```
This is telling you that your changes have increased the amount of CSS loaded, more than the required amount. This can lead to performance degradation so note that it should be avoided wherever possible (or be well justified!).

These problems are especially a concern for [CSS files on the critical path](https://www.smashingmagazine.com/2015/08/understanding-critical-css/). Always consider placing styles in an JavaScript entrypoint file e.g. `<file_name>--js.less` and load it inside `static/css/js-all.less` via `@import`. This CSS will only get loaded via JavaScript and has a much higher bundlesize threshold.



## Internationalization (i18n) - For programmers
Any text that will be visible to the user must be internationalized. The basics of web.py's `templator` I18N support is described here: http://webpy.org/cookbook/i18n_support_in_template_file

The two primary i18n message functions are:
* `gettext()` which is bound to '_' as a convenience since it's commonly used 
* `ngettext()` (or `ungettext()` as we've historically used) which currently needs to be spelled out, but is commonly bound to `N_`, so that's a convention we may adopt.

Examples:

| Template | Description |
| --- | --- |
| `<a title="$_('Add this book to your Want to Read shelf')">$_('Want to Read')</a>` | **Simple string i18n**: ~80% of i18n falls into this category. (Note that the title is translated as well since it's visible to the user in hover text.) |
| `$_("Hi, %(user)s", user=username)!` | **Substitution**: For rendering variables inside the string. |
| `$ungettext("There is %(count)d person waiting for this book.", "There are %(count)d people waiting for this book.", wlsize, count=wlsize)` | **Singular/Plural text**: For when you want to render things like "1 person" vs. "2 people" or "1 edition" vs. "2 edition**s**". \* |
| `$:_('Licensed under <a href="https://...">CC0</a>. Yippee!')` | **HTML i18n**: For when you want to include links in text; you should try to avoid this where possible because it requires the translator to copy the HTML exactly—but sometimes you can't avoid it. Note you _should not_ split up the sentence; it might not make sense in other languages. (Note the `:` before the `_`! That's what makes it render raw HTML.)\*\* |

\* In the translation file, this would look like:

```po
#: borrow.html:114
#, python-format
msgid "There is %(count)d person waiting for this book."
msgid_plural "There are %(count)d people waiting for this book."
msgstr[0] "%(count)d personne attend ce livre."
msgstr[1] "%(count)d personnes attendent ce livre."
```
The top of the file declares the number of different plural forms for the language since this varies widely among languages. There is more information on plural forms support here: https://www.gnu.org/software/gettext/manual/html_node/Plural-forms.html

\*\* This sentence however _can_ be represented without i18n-ing the HTML by using python template strings:

```html
$def cc0_link():
  <a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" title="$_('This link to Creative Commons will open in a new window')">$_('CC0')</a>

$:(_('By saving a change to this wiki, you agree that your contribution is given freely to the world under %s. Yippee!') % str(cc0_link()).strip())
```
In this way, only the text is presented to the translators.

Must DOs:
* Internationalize all user visible strings, including HTML `title` and `alt` which are used 
* Use consistent terminology and phrasing throughout the UI to reduce the amount of text which needs to be translated
* Use meaningful mnemonic parameter names to help the translators understand the context. e.g. "%(editioncount)d editions"
* Double check that the format string types match the types of parameters being passed. Mismatches will cause errors at runtime.
* Be sure to escape embedded quotes and apostrophes, if necessary, after wrapping strings in single/double quotes. e.g. "_$('Mustn\'t forget to escape')"
* Be sure to remove extra dollar signs ($) when wrapping expressions with $_()
* Generate a message catalog template (messages.pot) when user visible strings are added or change
* Make changes incrementally in small batches. Multiple preprocessors (templator + babel) can make error messages obscure, so it's easier to debug if you know what changed.

DON'Ts:
* Don't display internal status / keyword values from the code directly to the user. These can't be internationalized.
* Don't do pluralization or string concatenation in code or templates. This mandates ordering in ways that can't be translated. Give the translators completed sentences or phrases, with embedded replacements, to work with so they can create natural translations.
* Don't use inline styling or links in text, if at all possible. e.g. <em>, <a href=foo>
* Don't update the translated message catalogs. Because the merging process is inexact, it's better for the translators to handle this so that they can validate the results. Do update the message templates though (ie `messages.pot`)
* Don't hard code in `1` for singular nouns (e.g. `1 edition`) because in some languages, `0 editions` is singular and translated as `0 edition`. Instead, substitute a variable, as you would with the plural. E.g. `$ungettext("There is %(count)d person waiting for this book.", "There are %(count)d people waiting for this book.", wlsize, count=wlsize)` and **not** `$ungettext("There is 1 person waiting for this book.", "There are %(count)d people waiting for this book.", wlsize, count=wlsize)`

## Internationalization (i18n) - For translators

If you are updating an existing translation, run `scripts/i18n-messages update` to merge the new msgids from the `i18n/messages.pot` message templates into your `i18n/<lang>/messages.po` message catalog. Review all `fuzzy` matches and either remove the `fuzzy` keyword, if a correct match, or update and remove the `fuzzy` keyword. Make sure it's an exact match before removing the `fuzzy` label. Sometimes there are minor, but important changes like datatype changes, e.g. `%(count)s` to `%(count)d`. Also review all entries with an empty `msgstr` and add correct translations for them. 

If the text was revised and the update/matching algorithm didn't think it was a close enough match to even label a `fuzzy` match, you may find it at the bottom of the file in the section commented out with tildes (~). Any text in that section which is not useful to reuse or save, can be deleted.

Remember:
* keep the substitution variable names and data types unchanged in your translated text (e.g. `%(count)%s`)
* don't translate embedded HTML markup (e.g. <b>, <a href=>, etc)
* do escape any embedded quotes (e.g. `\"`)

If you are starting a new language translation, copy the template to the correct place in the directory hierarchy, add the plural forms info at the top and replace the English version of the `msgstr` text values with the translated versions for your language.

If you find something which can't be translated correctly (perhaps because the text is being concatenated in the code rather than in the message formatting), please create an issue describing the location and what the problem is.

## Browser Support

We support both Firefox and Chromium-based browsers on desktop and mobile (IOS and Android).

### Internet Explorer 11
As of May 14, 2021, Internet Explorer is in 10th (after Opera, Amazon Silk, and YaBrowser) with .32% (~1,172 patrons). Nearly of those all are IE11.

In short:
* Things should _function_ in IE11
* It is alright if things _look_ wonky in IE11

We will move away from IE11 support at some point, just like [Internet Archive did](http://blog.archive.org/2020/05/01/farewell-to-ie11/).

[Relevant Thread](https://internetarchive.slack.com/archives/C0ETZV72L/p1621029402256800)

