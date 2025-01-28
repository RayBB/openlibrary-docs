## Core View

* Authentication
  * [Account Create](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/upstream/account.py#L264-L333)
  * [Account Login](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/upstream/account.py#L399-L476)
* [My Books](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/upstream/mybooks.py) Account Page
  * Related PRs: [My Books page interim Mobile Navigation Fixes #6860](https://github.com/internetarchive/openlibrary/pull/7431)
  * Sidebar ask @szgrune
* The Books Page (e.g. https://openlibrary.org/books/OL12547191M)
  * PRs: [Canonical Books Page (Merging works & Editions UI) #123](https://github.com/internetarchive/openlibrary/pull/3553/files)
  * Controller: Infogami Type
  * [Edition Model](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/upstream/models.py#L42-L498) which extends [Core Model](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/core/models.py#L225-L463)
  * [Template](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/type/edition/view.html)
    * [Sidebar](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/macros/databarWork.html)
* The Search Page (e.g. https://openlibrary.org/search?q=goody)
  * [Controller](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/worksearch/code.py)
  * [Template](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/work_search.html)
    * [Result Cards](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/macros/SearchResultsWork.html)

## Imports

* Imports @scottbarnes
  * [Import Endpoints](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/importapi/code.py)
  * [Import Core APIs](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/catalog/add_book/__init__.py#L935-L1023)
  * [Imports Dashboard](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/admin/imports.html) (`/imports`)

## Functions

* Borrowing 
  * [Borrow Endpoint](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/upstream/borrow.py#L116-L248)
  * [Core Lending APIs](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/core/lending.py#L210-L232)
* Reading Log
  * TODO ask @jimchamp
* Lists
  * TODO ask @cdrini
* Community Tags / Observations
  * TODO ask @jimchamp
