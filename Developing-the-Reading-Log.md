This is a tutorial on contributing to the "My Books" experience and developing the Reading Log.

[![image](https://github.com/internetarchive/openlibrary/assets/978325/1bd5c677-d4b8-4f53-b8b6-2b51291ac72e)](https://archive.org/details/openlibrary-tour-2020/openlibrary-mybooks-primer.mp4)

## The Patron's Experience

When a patron clicks on their `My Book` main navigation button, they're brought to the url `/account/books` and shown `My Books` overview that provides a summary of their loans, lists, reading log, and more:

![image](https://github.com/internetarchive/openlibrary/assets/978325/443c20ef-c8b0-4e61-986f-ade8ef7aaade)

## Templates

The html template that renders the `My Books` experiences is called [books.html](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/account/books.html). This base template is used to render a variety of different my books pages consists of a left sidebar menu that looks like this:

![image](https://github.com/internetarchive/openlibrary/assets/978325/f30466ce-ddf2-42e7-8582-438875b96b46)

The `books.html` template also contains rules for deciding what primary content and sub-templates will be rendered to the right-side of the menu, e.g.:

![image](https://github.com/internetarchive/openlibrary/assets/978325/3c2c28e8-5e8f-46ae-b7ee-3670a983271c)

The main `books.html` base template is used to render the patron's...

* My Books Overview page (shown above)
* Loans page
  * ![image](https://github.com/internetarchive/openlibrary/assets/978325/67c3f7aa-e2ae-4d43-a2f3-15213ac8fb0e)
* Reading Log pages -- [example](https://openlibrary.org/people/mekBot/books/want-to-read)
  * ![image](https://github.com/internetarchive/openlibrary/assets/978325/120609d8-4764-4981-919d-00dad838d4f7)
* Lists overview page
  * ![image](https://github.com/internetarchive/openlibrary/assets/978325/88bb8024-226c-4792-a943-d3ed4bb4c98a)
* Individual List pages
  * <img width="624" alt="Screenshot 2023-10-05 at 9 41 36 PM" src="https://github.com/internetarchive/openlibrary/assets/978325/bc0cc8ba-8839-4eb8-8678-689bf4efd869">
* Loan History page (in development but will look similar to the Reading Log pages

## Routing

As explained in the Patron's Experience section above, when a patron clicks on their My Books button, they will be brought to `/account/books` which will then redirect to `/people/{openlibrary_username}/books`. The routers that handles these redirects is defined in https://github.com/internetarchive/openlibrary/blob/35d6b72c7851f260d673fbcd9ce3f95b0e9c3169/openlibrary/plugins/upstream/account.py#L792-L811. These redirects route to another set of routes defined in the mybooks.py plugin: https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/upstream/mybooks.py#L23-L44. These routers essentially look for any url pattern of the form `/people/{openlibrary_username}/{path}` and uses a controller in the same file, a class called `MyBooksTemplate` (defined on https://github.com/internetarchive/openlibrary/blob/35d6b72c7851f260d673fbcd9ce3f95b0e9c3169/openlibrary/plugins/upstream/mybooks.py#L184-L368) to render the appropriate my books view (such as overview, loans, loan history, reading log, lists, an individual list, etc).  

Depending on the `{path}` specified within the url, different models may be used to prepare and fetch data and different sub-templates will ultimately be within the `books.html` base template. Within the `MyBooksTemplate`, a variable named `key` is used to make determinations based on the `{path}` about what data to fetch and what sub-templates to render .

## Example Data Flow

* Patron types in the url `/account/books` after logging in, which is matched by the route in `plugins/account.py`
* Patron is redirected to `/people/{their_openlibrary_username}/books` which is matched by the `my_books_home` or `my_books_view` routes in `plugins/mybook.py` on https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/upstream/mybooks.py#L23
* The router calls the `MyBooksTemplate` controller with a key of `mybooks` (instructing it to fetch the corresponding data for, and to render, the `mybooks` view): https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/upstream/mybooks.py#L184
* In the preamble / initialization of the `MyBooksTemplate` controller, shared data will be fetched that is required by every view to generate the left sidebar menu (such as the logged in patron, the names of their lists, reading log counts): https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/upstream/mybooks.py#L202-L237
* Next, different `if` statements and control structures are hit to determine which data we should load and send to `templates/books.html` based on the `key` derived from the url pattern (e.g. `mybooks`, `lists`, `loan_history`, etc).
* In this example, we determine based on the url we're on and the `key` value specified, that the LoggedBooksData model should be used to fetch the book data we need to render our view: https://github.com/internetarchive/openlibrary/blob/35d6b72c7851f260d673fbcd9ce3f95b0e9c3169/openlibrary/plugins/upstream/mybooks.py#L254-L270 
* Eventually, when all the appropriate data is collected, it will be passed into the books.html base template: https://github.com/internetarchive/openlibrary/blob/35d6b72c7851f260d673fbcd9ce3f95b0e9c3169/openlibrary/plugins/upstream/mybooks.py#L288-L303 
* In `books.html`, logic is defined that dynamically determines what the title of the web page should be (https://github.com/internetarchive/openlibrary/blob/35d6b72c7851f260d673fbcd9ce3f95b0e9c3169/openlibrary/templates/account/books.html#L27-L54), renders the left sidebar (https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/account/books.html#L74) and then renders the correct child template for this view: https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/account/books.html#L154-L173

## Extending the My Books system

1. A new router defining your desired url pattern needs to be defined in `plugins/mybooks.html`, such as is done by `my_books_view`. This router should make a call to `MyBooksTemplate().render()`
2. `MyBooksTemplate` should be updated so there is an additional check within the `if` / `elif` control flow for the new `key` or page you wish to add. This section should fetch the books or data which will be required by the view.
3. You'll want to update `templates/book.html` (the base template for all of `My Books` views) so that it defines what the title should be and what templates should be rendered when your url pattern / `key` is encountered.
4. You may then have to create a new template within `templates/account/` that renders the data in a suitable way. In many cases, we'll want to refer to the `account/reading_log.html` template as the basis for our design: https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/account/reading_log.html

For a complete, minimal example of adding a new page or view to the My Books system, please refer to [PR #8375](https://github.com/internetarchive/openlibrary/pull/8375) as well as [this comment](https://github.com/internetarchive/openlibrary/pull/8375#issuecomment-1749963570) which describes how data specific to a new `loan_history` page may be prepared that is suitable to be passed through the `account/books.html` base template.

## Extending the Reading Log: An (outdated) example

NOTE: This section is now outdated as much of the routing and controller logic has been moved out of `plugins/upstream/account.py` and in to `plugins/upstream/mybooks.py`, into the `MyBooksTemplate`. Still, this section is useful to see how we went about extending the functionality of the Reading Log page to add the ability to search for books on your currently reading, want to read, and already reading shelves.

In [#5080](https://github.com/internetarchive/openlibrary/issues/5080), you can read through a slightly unrealistic example of adding Search filtering capabilities to the Reading Log:

By unrealistic, we mean that this proposal currently will not work as implemented because book titles, authors, and the other data we'd like to search for are not kept in our ReadingLog db table, only the OL identifiers. We may be able to achieve this with solr in the future. But assuming we did have the desired info in our database (and as a thought exercise):

1. First, we'd need to update the Reading Log html template (https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/account/books.html) to include a search box (design task). For a first version, we'd probably use an html form which submits a GET search query , similar to what we have on the author's page: https://openlibrary.org/authors/OL7283091A
![openlibrary org_authors_OL7229114A_Robert_Alan_Hill (1)](https://user-images.githubusercontent.com/978325/115574144-38ef9c80-a276-11eb-9ff9-5c53f78e45cb.png). In the future, we might want to use javascript (similar to how we the real-time Search box works at the top of the website):
![openlibrary org_authors_OL7229114A_Robert_Alan_Hill (2)](https://user-images.githubusercontent.com/978325/115574443-7a804780-a276-11eb-875f-5325f5b61ebc.png)
2. Next, we'd need to update the `public_my_books` controller method in https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/upstream/account.py#L733-L760 to accept a GET parameter. Already, the function expects a `page` variable to be sent as a GET parameters (https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/upstream/account.py#L738) so accomplishing this should be as straightforward as adding another parameters like, `i = web.input(page=1, search=None)`.
3. When/where we fetch the patron's books here: https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/upstream/account.py#L754, we need to alter the logic to check whether a `i.search` query is present (e.g. `if i.search`). If the `i.search` value is present, we'll need change the line `readlog.get_works` call so this optional `search` parameter is passed along with our request for matching books.
4. `readlog` is an instance of `plugins.upstream.account.ReadingLog` (class defined here: https://github.com/internetarchive/openlibrary/blob/1f57759886b65430d805270830677120c1dc067d/openlibrary/plugins/upstream/account.py#L645). Its `get_works` method (https://github.com/internetarchive/openlibrary/blob/1f57759886b65430d805270830677120c1dc067d/openlibrary/plugins/upstream/account.py#L716) will need to be updated to accept an optional `search` parameter (e.g. `(key, page=1, limit=RESULTS_PER_PAGE, search=None)`). This `ReadingLog.get_works` function essentially uses a `KEYS` dictionary (defined here: https://github.com/internetarchive/openlibrary/blob/1f57759886b65430d805270830677120c1dc067d/openlibrary/plugins/upstream/account.py#L654-L660) to lookup and then invoke the proper book-fetching function.
5. Each of the corresponding `ReadingLog` methods referenced by the `KEYS` dictionary (namely: `get_waitlisted_editions`, `get_loans`, `get_want_to_read`, `get_currently_reading`, `get_already_read`) must thus also be updated to take an optional `search` parameter. Each of these functions ultimately makes an API call to the same function within our `Bookshelves` API model: `Bookshelves.get_users_logged_books` (https://github.com/internetarchive/openlibrary/blob/master/openlibrary/core/bookshelves.py#L118-L149)
6. After a search box form has been added to the `template`, the `public_my_books` view/controller has been edited to expect a `search` parameter, this `search` parameter is forwarded to our `readlog.get_works` call, and the `readlog` object (i.e. the `ReadingLog` class) have all been updated to accept an optional `search` parameter, we'll then need to do the hard work of modifying the actual API `Bookshelves.get_users_logged_books` (the thing which calls the database) to consider the possibility of an optional search parameter when requesting data from the database: https://github.com/internetarchive/openlibrary/blob/master/openlibrary/core/bookshelves.py#L118-L149).

[The same example above](https://github.com/internetarchive/openlibrary/issues/5080#issue-864008133) (which pretends to add Search filtering to the Reading Log) can be adapted to add an option to sort one's Reading Log entries by date added, such as is requested in [Issue #4267](https://github.com/internetarchive/openlibrary/issues/4267).

