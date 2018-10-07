There are multiple paths by which data can be imported into Open Library.

1. Through the website UI and the Open Library Client which both use the endpoint: https://openlibrary.org/books/add 
   * code: [openlibrary/plugins/upstream/addbook.py](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/upstream/addbook.py) 
   * tests: [openlibrary/plugins/upstream/tests/test_addbook.py](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/upstream/tests/test_addbook.py)
2. Through the [data import API](https://github.com/internetarchive/openlibrary/wiki/Endpoints#importing): https://openlibrary.org/api/import
    * code: [openlibrary/plugins/importapi/code.py](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/importapi/code.py)
3. By reference to archive.org items via the [IA import endpoint](https://github.com/internetarchive/openlibrary/wiki/Endpoints#importing): https://openlibrary.org/api/import/ia 
    * code: [openlibrary/plugins/importapi/code.py](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/importapi/code.py) which calls `openlibrary.catalog.add_book.load()` in [openlibrary/catalog/add_book/\_\_init\_\_.py](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/catalog/add_book/__init__.py)
 Checking for existing works and editions is performed here in `openlibrary.catalog.add_book.exit_early()`
    * Add book tests: [openlibrary/catalog/add_book/test_add_book.py](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/catalog/add_book/test_add_book.py)
4. Through our privileged ImportBot [scripts/manage_imports.py](https://github.com/internetarchive/openlibrary/blob/master/scripts/manage-imports.py)  which POSTs to the IA import API via `Openlibrary.import_ocaid()` from [openlibrary/api.py](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/api.py) 
3. Through bulk import API [openlibrary/api.py](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/api.py) -- this should be considered deprecated

## Bulk MARC Import

We are in the process of expanding the `api/import/ia` endpoint functionality.

**From a conversation with @mek + @hornc**
We're going to write a `ImportBulkMarcIABot` in `openlibrary-bots`

1. For a given bulk archive.org item within ol_data collection, iterate over all its .mrc files.
2. For each .mrc file, retrieve the length of the first binary marc using the length (i.e. 1st) component of the LEADER field so we know when the first MARC records stops
e.g. http://www.archive.org/download/trent_test_marc/180221_ItemID_Test_001.mrc?range=0:5
3. We'll use ^ with the correct item + file to get the first MARC and then use the LEADER to process the rest
4. We'll take the MARC, call the MarcBinary code in `openlibrary/catalog/marc/marc_binary.py`
5. We'll have to exposed a new endpoint within `openlibrary/plugins/importapi/code.py` for MARC import (w/o IA book item) 
6. Add `"local_id": ["urn:trent:12345"]`key to openlibrary book metadata in addition to correctly formatted `source_record` so archive.org can search for the records using the OL books API from