This guide describes how a network request from a patron flows through the Open Library application.

## The Patron Submits a Request

When a patron navigates to an Open Library url in their browser, like https://openlibrary.org/home, the first thing that happens is: the URL is resolved to the IP (e.g. `ol-www0.us.archive.org` at `207.241.234.205` for the production or the `openlibrary-web-1` docker container for development) by DNS.

## The Web Server

The `Web Server` (in our case `nginx`) uses a reverse proxy setup (in production, load-balanced by haproxy across multiple servers) to redirect the patron to a server running the Open Library web.py python application.

## The Open Library Application

### The URL Preprocessor

Once the request arrives at the Open Library application, the requested `url` is pre-processed by [`readableurls.py`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/core/processors/readableurls.py) which has two tasks:
1. to expand, normalize, and re-write the url (e.g. the http://openlibrary.org/b/OL10317216M short-hand redirects to https://openlibrary.org/books/OL10317216M/Lords_of_the_Ring) and
2. to see whether the resource requested is for a special first-class infogami type [registered](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/core/models.py#L1228-L1241) with the application, in which case it will be intercepted and forwarded along this path, or whether the request should be handled by a plugins controller we've defined.

### Handling Infogami Types

Open Library sits on top of a Wiki/CRM platform called [Infogami](https://openlibrary.org/dev/docs/infogami) which allows us to define special page types. By default, an Infogami wiki page (like https://openlibrary.org/about) is of `/type/page`. Over time, we've defined several special page types (e.g. `/type/page`, `/type/edition`, `/type/work`, `/type/author`, `/type/user` -- you can explore all of them here: https://openlibrary.org/type).

Unlike most endpoint controllers we explicitly register within `/openlibrary/plugins` (which we will next explain in the [Routing & Controllers](#Routing--Controllers) section), Infogami has a generic engine which implicitly / invisibly defines controllers for its first-class types. This engine automatically resolves pages of designed infogami types to their corresponding templates, without there being any explicit controller represented in the code. This can sometimes make it really confusing when you're trying to figure out where the code is for a specific endpoint (spoiler: it probably only exists abstractly).

If `readableurls.py` determines that the requested URL does map to an infogami type, the infogami engine will generically fetch the requested page object (e.g. `/about` or `/edition/OL...M`) from infogami's [`infostore`](https://openlibrary.org/dev/docs/infostore) database and pass it directly to its corresponding infogami template, having the matching type name (e.g. edition, page, work, author, etc) within the `/openlibrary/templates/type` directory.

Re-iterated, infogami pages don't have different explicit controllers defined within the code -- urls which address infogami pages are caught by infogami, the matching db object is fetched by infogami and passed as generic variable called page into special infogami-specific templates which live in /openlibrary/templates/type/{type}/view.html via the line $def with (page). The corresponding properties and attributes of page are confusingly defined (according to the page's type) in /openlibrary/plugins/upstream/models.py

As an example, a url request for book pages (e.g. `/books/OL...M`) will not have routers/controllers defined within the code. Instead, the key in the url will be automatically resolved to an edition [infogami](https://openlibrary.org/dev/docs/infogami) object in the database, and then this fetched object will be passed directly into its corresponding [`type/`](https://github.com/internetarchive/openlibrary/tree/master/openlibrary/templates/type) template (e.g. https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/type/edition/view.html#L1), often as the parameter `page` or `doc`.

This special [infogami](https://openlibrary.org/dev/docs/infogami) pattern applies for any of the first-class types defined in [`core/models.py`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/core/models.py#L1228-L1241), such as `authors` and `tags`. You can check the [Endpoints](https://github.com/internetarchive/openlibrary/wiki/Endpoints) table to see which templates correspond to which endpoint.

### Routing & Controllers

Most [Endpoints](https://github.com/internetarchive/openlibrary/wiki/Endpoints) on Open Library are explicitly defined by us in the [`plugins/`](https://github.com/internetarchive/openlibrary/tree/master/openlibrary/plugins) directory, whose organization is described in depth by [this technical overview video](https://archive.org/embed/openlibrary-tour-2020/technical_overview.mp4?start=1017).

In the case of our example, where the patron is requesting the `/home` page, the [Endpoints](https://github.com/internetarchive/openlibrary/wiki/Endpoints) map shows us its corresponding controller is defined in [`plugins/openlibrary/home.py`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/openlibrary/home.py#L94-L102). 

This `home` controller class asserts a url pattern that it's responsible for handling (i.e. `/home`).

### Models & Views

Web.py, the python micro-web framework used by Open Library, exposes a variable called `web.ctx` which maintains the context of the application and the client during/across a http request. Web.py also maintains a `web.db` connection to our postgres database. Web.py allows us to fetch query parameters from the patron's request, consult the patron's anonymized IP or request headers, check the patron's cookie to see if they're logged in, etc.

Once inside the controller, the `web.ctx`, `web.db`, and [core models](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/core/models.py) may be used to fetch the relevant data required to respond to the patron's request.

Once the necessary data is fetched (where applicable), the controller either returns the raw data to the patron in the form of an API (json, opds, etc) or passes it into a template file (in this case, [`templates/home/index.html`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/home/index.html)), where it is then rendered, and returned to the patron.

Now that you've traced the lifecycle of a http request through the Open Library application, you may be interested in this tutorial to[Implement a new Route](https://github.com/internetarchive/openlibrary/tree/master/openlibrary/plugins#tutorial-implementing-a-new-route) or [Creating a new Infogami Type](https://openlibrary.org/dev/docs/infogami#anchor15).