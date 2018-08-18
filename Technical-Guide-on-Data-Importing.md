There are three paths by which data can be imported into Open Library.

1. Through the website UI and the Open Library Client which both use the endpoint: http://openlibrary.org/books/add
2. Through our privileged ImportBot scripts/manage_imports.py which calls openlibrary/plugins/importapi/code.py
3. Through bulk import API https://github.com/internetarchive/openlibrary/blob/master/openlibrary/api.py -- this should be considered deprecated

