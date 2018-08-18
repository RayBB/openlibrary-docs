There are three paths by which data can be imported into Open Library.

1. Through the website UI and the Open Library Client which both use the endpoint: http://openlibrary.org/books/add
2. Through our privileged ImportBot scripts/manage_imports.py which calls openlibrary/plugins/importapi/code.py
3. Through bulk import API https://github.com/internetarchive/openlibrary/blob/master/openlibrary/api.py -- this should be considered deprecated

## MARC Import

We are in the process of designing a 4th entry point called ImportBulkMarcIA which will call a modified version of openlibrary/plugins/importapi/code.py which incorporates the safety and duplication checks performed by #1 (the /books/add endpoint).

**From a conversation with @mek + @hornc**
We're going to write a `ImportBulkMarcIABot` in `openlibrary-bots`

1. For a given bulk archive.org item within ol_data collection, iterate over all its .mrc files.
2. For each .mrc file, retrieve the length of the first binary marc using the length (i.e. 1st) component of the LEADER field so we know when the first MARC records stops
e.g. http://www.archive.org/download/trent_test_marc/180221_ItemID_Test_001.mrc?range=0:5
3. We'll use ^ with the correct item + file to get the first MARC and then use the LEADER to process the rest
4. We'll take the MARC, call the MarcBinary code in `openlibrary/catalog/marc/marc_binary.py`
5. We'll have to exposed a new endpoint within `openlibrary/plugins/importapi/code.py` for MARC import (w/o IA book item) 
6. Add `"local_id": ["urn:trent:12345"]`key to openlibrary book metadata in addition to correctly formatted `source_record` so archive.org can search for the records using the OL books API from