
In order for Open Library users to access readable and borrowable books from archive.org, the respective data records need to be correctly synchronised.

This page documents the specific and technical requirements, and lists potential challenges to keeping the records synchronised.

## Technical requirements

* All archive.org book items with a populated `openlibrary` metadata field should also have `openlibrary_edition`.
  * [CRITERION NOT MET QUERY](https://archive.org/search.php?query=mediatype%3Atexts+AND+openlibrary%3A%2A+AND+NOT+openlibrary_edition%3A%2A): `mediatype:texts AND openlibrary:* AND NOT openlibrary_edition:*`
  
* All archive.org book items with `openlibrary_edition` **MUST** have `openlibrary_work`, and vice versa.
   * [CRITERION NOT MET](https://archive.org/search.php?query=mediatype%3Atexts%20AND%20openlibrary_edition%3A%2A%20AND%20NOT%20openlibrary_work%3A%2A): mediatype:texts AND openlibrary_edition:* AND NOT openlibrary_work:*
   * [CRITERION NOT MET](https://archive.org/search.php?query=mediatype%3Atexts%20AND%20openlibrary_work%3A%2A%20AND%20NOT%20openlibrary_edition%3A%2A): mediatype:texts AND openlibrary_work:* AND NOT openlibrary_edition:*