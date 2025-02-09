## Core Views

| Page             | Screenshot | URL Endpoints → Controllers | Templates | Models | Reference PRs | Maintainer |
|------------------|------------|-----------------------------|-----------|--------|---------------|------------|
| **Homepage**     | ![image](https://github.com/user-attachments/assets/295ee51b-4898-4cd4-8859-2b9c63b7f7ef) | [`/`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/openlibrary/home.py#L94-L102) | [`home.html`]() | | | `@mekarpeles` |
| **Books Page**   | <img width="696" alt="Screenshot 2025-02-09 at 9 53 42 AM" src="https://github.com/user-attachments/assets/15a1e491-8334-418c-b5cf-377a1e3edb90" /> | [`/books/OL{edition_id}M/` <br> `/works/OL{work_id}W/`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/core/models.py#L1233-L1234) | [`type/edition/view.html`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/type/edition/view.html) <br><ul><li>[Sidebar](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/macros/databarWork.html)</li></ul> | [`Edition`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/upstream/models.py#L42-L498) + [`Work`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/upstream/models.py#L557-L837) which extend [`core/models.py`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/core/models.py#L224-L463) | [Unified Books Page: Merging Work & Edition UI #123](https://github.com/internetarchive/openlibrary/pull/3553/files) | `@jimchamp` |
| **Subjects Page** | <img width="706" alt="Screenshot 2025-02-09 at 9 55 29 AM" src="https://github.com/user-attachments/assets/57842965-0f24-45ed-9b35-a3002921302c" /> | [`/subjects/{subject}`](https://github.com/internetarchive/openlibrary/blob/06fe991e78d543ae0dd42a6dbaece5a126883ba5/openlibrary/plugins/worksearch/subjects.py#L25-L49) | [`subjects.html`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/subjects.html) | | | `@jimchamp` |
| **Search Page**      | <img width="682" alt="Screenshot 2025-02-09 at 9 56 57 AM" src="https://github.com/user-attachments/assets/1c9e97a7-537b-46b0-bdad-b83ac45790f2" /> | [`/search?q={query}`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/worksearch/code.py) | [`work_search.html`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/work_search.html) <br><ul><li>[`SearchResultsWork.html`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/macros/SearchResultsWork.html)</li></ul> | | | `@cdrini` |
| **Account Creation** | <img width="630" alt="Screenshot 2025-02-09 at 9 58 08 AM" src="https://github.com/user-attachments/assets/c4f0c7b6-54f4-40e6-aa10-1cbbe7472313" /> | [`/account/create`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/upstream/account.py#L264-L333) | [`create.html`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/account/create.html) | | | `@cdrini` |
| **Account Login**    | <img width="634" alt="Screenshot 2025-02-09 at 9 58 30 AM" src="https://github.com/user-attachments/assets/23853bd7-00ee-4452-8576-43d1fb488169" /> | [`/account/login`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/upstream/account.py#L399-L476) | [`login.html`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/login.html) | | | `@cdrini` |
| **My Books Page** | <img width="704" alt="Screenshot 2025-02-09 at 9 59 27 AM" src="https://github.com/user-attachments/assets/7b825d2c-4c88-4688-a984-133b3b662bfc" /> | [`/account/books`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/upstream/account.py#L838-L857) → [`/people/{username}/books`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/upstream/mybooks.py#L44-L57) | [`account/view.html`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/account/view.html) | | [My Books page interim Mobile Navigation Fixes #6860](https://github.com/internetarchive/openlibrary/pull/7431) | `@mekarpeles`<br>`@szgrune` |






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

* Endpoints
  * [Works](https://github.com/internetarchive/openlibrary/wiki/Endpoints#works)
  * [Editions](https://github.com/internetarchive/openlibrary/wiki/Endpoints#editions)