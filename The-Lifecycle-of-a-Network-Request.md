This guide describes how a network request from a patron flows through the Open Library application.

## The Patron Submits a Request

When a patron navigates to an Open Library url in their browser, like https://openlibrary.org/home, the first thing that happens is: the URL is resolved to the IP (e.g. `ol-www0.us.archive.org` at `207.241.234.205` for the production or the `openlibrary-web-1` docker container for development) by DNS.

## The Web Server

The `Web Server` (in our case `nginx`) uses a reverse proxy setup (in production, load-balanced by haproxy across multiple servers) to redirect the patron to a server running the Open Library web.py python application.

## The Open Library Application

### The URL Preprocessor

Once the request arrives at the Open Library application, the requested `url` is pre-processed by [`readableurls.py`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/core/processors/readableurls.py) which:
1. may expand, normalize, and re-write the url (e.g. the http://openlibrary.org/b/OL10317216M short-hand redirects to https://openlibrary.org/books/OL10317216M/Lords_of_the_Ring) and/or
2. map human readable urls (e.g. `/books/OL...M`) to certain internal infogami types Open Library has [registered](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/core/models.py#L1228-L1241) in its types database (e.g. `/editions/OL...M`).

In particular, urls for book pages (e.g. `/books/OL...M`) will not have routers/controllers defined within the code. Instead, the key in the url will be automatically resolved to an edition [infogami](https://openlibrary.org/dev/docs/infogami) object in the database, and then this fetched object will be passed directly into its corresponding [`type/`](https://github.com/internetarchive/openlibrary/tree/master/openlibrary/templates/type) template (e.g. https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/type/edition/view.html#L1), often as the parameter `page` or `doc`.

This special [infogami](https://openlibrary.org/dev/docs/infogami) pattern applies for any of the first-class types defined in [`core/models.py`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/core/models.py#L1228-L1241), such as `authors` and `tags`. You can check the [Endpoints](https://github.com/internetarchive/openlibrary/wiki/Endpoints) table to see which templates correspond to which endpoint.

### Routing & Controllers

Most [Endpoints](https://github.com/internetarchive/openlibrary/wiki/Endpoints) on Open Library are explicitly defined by us in the [`plugins/`](https://github.com/internetarchive/openlibrary/tree/master/openlibrary/plugins) directory, whose organization is described in depth by [this technical overview video](https://archive.org/embed/openlibrary-tour-2020/technical_overview.mp4?start=1017).

In the case of our example, where the patron is requesting the `/home` page, the [Endpoints](https://github.com/internetarchive/openlibrary/wiki/Endpoints) map shows us its corresponding controller is defined in [`plugins/openlibrary/home.py`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/openlibrary/home.py#L94-L102). 

This `home` controller class asserts a url pattern that it's responsible for handling (i.e. `/home`).

### Models & Views

Inside the controller, relevant data needed by the page will often be fetched from various [models](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/core/models.py) that make calls to the database.

Once the necessary data is fetched (where applicable), the controller either returns the raw data to the patron in the form of an API (json, opds, etc) or passes it into a template file (in this case, [`templates/home/index.html`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/home/index.html)), where it is then rendered, and returned to the patron.

Now that you've traced the lifecycle of a http request through the Open Library application, you may be interested in this tutorial to[Implement a new Route](https://github.com/internetarchive/openlibrary/tree/master/openlibrary/plugins#tutorial-implementing-a-new-route) or [Creating a new Infogami Type](https://openlibrary.org/dev/docs/infogami#anchor15).