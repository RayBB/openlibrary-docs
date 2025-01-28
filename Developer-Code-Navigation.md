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

## Librarian Tools

* Author Merges
  * Related PRs: [ Preserve mrid when deprecated keys are passed in merge_authors #10237 ](https://github.com/internetarchive/openlibrary/pull/10237), [ Add retry logic to author merge request status update #10268 ](https://github.com/internetarchive/openlibrary/pull/10268), [ support comma separated author merge url #10114 ](https://github.com/internetarchive/openlibrary/pull/10114)
  * [Controller](https://github.com/internetarchive/openlibrary/blob/c8e26213fb0516ec68228fb5ce140687594cab6b/openlibrary/plugins/upstream/merge_authors.py#L249)
  * [Template](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/merge/authors.html)

* Work Merges
  * Related PRs: [ Work Merge UI + ILE (Integrated Librarian Environment) #3408 ](https://github.com/internetarchive/openlibrary/pull/3408), [ Displays author name on merge #9920 ](https://github.com/internetarchive/openlibrary/pull/9920), [ Work Merge Undo #6948 ](https://github.com/internetarchive/openlibrary/pull/6948)
  * [Controller](https://github.com/internetarchive/openlibrary/blob/c8e26213fb0516ec68228fb5ce140687594cab6b/openlibrary/plugins/upstream/code.py#L136)
  * [Template](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/merge/works.html)
  * [MergeUI (Vue.js)](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/components/MergeUI.vue)

* Merge Queue
  * Related PRs: [ Merge Queue tweaks #8591 ](https://github.com/internetarchive/openlibrary/pull/8591), [ adds sort, submitter, reviewer dropdown menus to merge queue #7868 ](https://github.com/internetarchive/openlibrary/pull/7868)
  * [Controller](https://github.com/internetarchive/openlibrary/blob/c8e26213fb0516ec68228fb5ce140687594cab6b/openlibrary/plugins/upstream/edits.py#L31)
  * [Template](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/merge_request_table/merge_request_table.html)

* ILE (Integrated Librarian Environment)
  * Related PRs: [ Increase search path for shift-click common parent #10247 ](https://github.com/internetarchive/openlibrary/pull/10247), [ Restrict ILE dragging to ile-selectable items #8495 ](https://github.com/internetarchive/openlibrary/pull/8495), [ Work Merge UI + ILE (Integrated Librarian Environment) #3408 ](https://github.com/internetarchive/openlibrary/pull/3408)
  * [Index](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/openlibrary/js/ile/index.js)
  * [SelectionManager](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/openlibrary/js/ile/utils/SelectionManager/SelectionManager.js)
