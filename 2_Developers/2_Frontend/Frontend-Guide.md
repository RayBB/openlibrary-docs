Welcome to the Front-End Guide for Open Library, a primer for making front-end changes to the openlibrary.org website.
 
- [File Organization Overview](#File-Organization-Overview)
- [Overview of Endpoints](../3_Backend/Endpoints.md)  
- [CSS & HTML](#css-js-and-html)
  - [Building CSS & JS](#building-css-and-js)
  - [Working with CSS](#working-with-css)
  - [Working with HTML Templates](#working-with-html)
- [Working with Javascript](#working-with-javascript)

- [Routing & Templates](#routing-and-templates)
- [URL Routing](#url-routing)
- [The Lifecycle of a Network Request](#The-Lifecycle-of-a-Network-Request)
- [Partials](#partials)
- [Infogami Types](#infogami-types)
- [Outdated Design Pattern Library](/3_Designers/Design-Pattern-Library)

## File Organization Overview

- **assets**: css/less in /static/css and js in /openlibrary/plugins/openlibrary/js
- **models**: `/openlibrary/core/` and `/openlibrary/plugins/upstream/models.py`, data + ORM
- **controllers**: in `/openlibrary/plugins/` (maps urls [via regex] → classes w/ GET + POST functions which receive/serve content to clients)
- **templates**: in `/openlibrary/templates` and `openlibrary/macros`. Macros are special template components because they can be rendered (by librarians + admins) within infogami wiki pages using the syntax:
```
{{macros()}}
```

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
- If you are using an Intel-based Mac and get an error building JavaScript, specifically `make: *** [Makefile:24: js] Error 139`, consider downgrading Docker Desktop to [Docker 4.18.0](https://docs.docker.com/desktop/release-notes/#4180). See https://github.com/docker/for-mac/issues/6824 for more.

### Working with CSS

All stylesheets are in `static/css`. They are combined to generate `build/css/all.css`, which is included in all the web pages.

It's a good idea to break CSS into multiple logical files, instead of putting it in one monolithic file.

If you make changes to any CSS, see [Building CSS and JS](#building-css-and-js) to regenerate `build/css/all.css`.

We are transitioning towards using [BEM notation](http://getbem.com/) for CSS classes. Please bear this in mind when contributing to our codebase and providing new classes or modifying existing classes. This simplifies our CSS and makes it easier to manage.

#### Finding a css file

Use the browser's inspector developer tools to find the CSS class name and then use `git grep` to find the file. Note that for some elements like `cta-btn--available` it may be easier to search for a subpart of the class, like `--available` as many of our css documents have nested styles and define partial rules like `&--available`. 

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

#### Linking New Javascript Files to HTML Templates

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

<hr>

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

[The lifecycle of an Open Library network request](https://github.com/internetarchive/openlibrary/wiki/The-Lifecycle-of-a-Network-Request).

## Adding a new Router

To add a new Router to Open Library, refer to the tutorial in our [plugins README](https://github.com/internetarchive/openlibrary/tree/master/openlibrary/plugins/README.md).

## Partials

In some cases, we may want a page to load quickly with a minimal template and then fetch more components using javascript after the page finishes loading. For instance, on the books page, we try to fetch and show book prices in a sidebar, but this component can be slow to load, so instead of fetching this data on the backend and returning it along with the template, we augment the template with javascript instructions to load a Partial after the minimal book page is finished loading:

<img width="244" alt="Screenshot 2024-05-07 at 11 44 58 AM" src="https://github.com/internetarchive/openlibrary/assets/978325/a2cab857-4650-40be-9173-7ccc3d4dfc79">

A Partial is a targeted endpoint that returns only the minimal html required for rendering a specific, isolated component, such as a "related books carousel" or a "book price widget".

In PR [#8824](https://github.com/internetarchive/openlibrary/pull/8824) you can see a complete example of where the "blocking" synchronous book price widget was removed from the Book Page and replaced with an asynchronous javascript call to a Partial that fetched book data after page load.

In order for the data-infused partial to be rendered within a template, you’ll need to edit &/or create the following files and understand how they need to interact:

**What files do I need?** 
 1. The template - the html file in the [templates folder](https://github.com/internetarchive/openlibrary/tree/master/openlibrary/templates) where you intend the partial to render
 2. The partial - an html file in the [macros folder](https://github.com/internetarchive/openlibrary/tree/master/openlibrary/macros)
 3. The partial’s JS - a js file in the [js folder](https://github.com/internetarchive/openlibrary/tree/master/openlibrary/plugins/openlibrary/js) that makes the call to the partials endpoint and receives the data to load into the partial
 4. [index.js](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/openlibrary/js/index.js) - the js file that connects the partial to its JS file
 5. [code.py](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/openlibrary/code.py) - the python file where the Partials endpoint lives. The JS file makes a call to this endpoint, passing in the macro or placeholder. The GET function makes a call to the backend, then calls the macro with the returned data, and returns the data-infused macro back to the partial’s JS.

**How to get these files to interact?**
 1. Connect the Template to the Partial (2 methods)
	 - Placeholder: Create an HTML element with an id in the file where you’d like the Partial to render.  
		 - Eg: Here in the [work_search.html](https://github.com/merwhite11/openlibrary/blob/2df06de69aa9cf555377af1a2b90ad467de35aff/openlibrary/templates/work_search.html#L126) template, the div with the id “fulltext-search-suggestion” serves as a placeholder for where the [Fulltext-Search-Suggestion](https://github.com/merwhite11/openlibrary/blob/1001/feature/fulltext-search-box/openlibrary/macros/FulltextSearchSuggestion.html) partial will be inserted.
	 - Direct call: Directly call the partial in the template, passing in the parameters  
		 - Eg: In [view.html](https://github.com/internetarchive/openlibrary/blob/3cb7cfeb658f6e97b05f23e4e248ac9d0a8db3a8/openlibrary/templates/type/edition/view.html#L317) template, the [AffiliateLinks](https://github.com/merwhite11/openlibrary/blob/1001/feature/fulltext-search-box/openlibrary/macros/AffiliateLinks.html) partial is called directly.
		
 2.  Connect the Partial placeholder or the Partial itself to the Partial’s JS
	 - This connection takes place in [index.js](https://github.com/merwhite11/openlibrary/blob/2df06de69aa9cf555377af1a2b90ad467de35aff/openlibrary/plugins/openlibrary/js/index.js#L551)
	 - The element with the id we assigned to the placeholder/partial above is selected
	 - The partial's JS file is imported and the init function called
   

3.  Connect the Partial’s JS to the Partial endpoint
    - The [Partial’s JS](https://github.com/internetarchive/openlibrary/blob/37db01e97fafaeec1f36951050b06f836442ca71/openlibrary/plugins/openlibrary/js/affiliate-links.js#L54) makes a call to the [Partial endpoint](https://github.com/internetarchive/openlibrary/blob/3cb7cfeb658f6e97b05f23e4e248ac9d0a8db3a8/openlibrary/plugins/openlibrary/code.py#L1045). The call returns the data-infused partial to the partial’s js where it’s added to the template or the placeholder on the template.



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

## Browser Support

We support both Firefox and Chromium-based browsers on desktop and mobile (IOS and Android).

### Internet Explorer 11
As of May 14, 2021, Internet Explorer is in 10th (after Opera, Amazon Silk, and YaBrowser) with .32% (~1,172 patrons). Nearly of those all are IE11.

In short:
* Things should _function_ in IE11
* It is alright if things _look_ wonky in IE11

We will move away from IE11 support at some point, just like [Internet Archive did](http://blog.archive.org/2020/05/01/farewell-to-ie11/).

[Relevant Thread](https://internetarchive.slack.com/archives/C0ETZV72L/p1621029402256800)

