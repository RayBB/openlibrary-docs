This page attempts to document the actual admin process of performing each kind of merge so it can be performed, manually, automated by Bot, and/or eventually brought into the core OL codebase as an admin or trusted user function.

## Pre-Merge States

Theorising that these apply equally to all record types, Work, Edition, and Author: 

1. One record is clearly better, and the other can be safely discarded (i.e less good record's attributes are a subset of the better record)
1. There is an obvious way to merge data cleanly (copying missing attributes from one to the other) to make a more complete record
1. There are differences/conflicts within the same attributes and no way to decide programatically what to do, so human editing is required ... or maybe they really are different entities?

(Feature request in openlibray-client for a diff tool that distinguishes these states https://github.com/internetarchive/openlibrary-client/issues/7)

## Straightforward Merge Works

(hypothetical function)

    merge_works(duplicate, canonical)

where duplicate is a work ID, or list of work IDs to be merged into the canonical record.

### Scope
* Assumes the duplicate work is a minimal work entry and/or there is no relevant data to be copied across from the duplicate to the canonical work. This can be done manually in a prior operation if needed.
* Does not fix any duplicate editions before, or as a result of the the merge. Duplicate Editions will be dealt with separately.

### Steps

* Get list of editions under duplicate
* OPTIONAL? Clear out explicit author fields on editions. Author should be attached to work. Beware of edition specific roles?
* Reassign each edition's work to the canonical work id, with informative `_comment`
* Change the duplicate work's type to `/type/redirect` with link to the canonical work, and add informative `_comment`

**Housekeeping:** Tidy duplicate / unattached author records resulting from the merge (if any). Ensure that the duplicate work's author record is now not unattached from any works (i.e. check the the old Author does not have 0 works). If the old duplicate author record has 0 works, and is a duplicate of the canonical author record, edit the old author to type = `/type/redirect` with link to the canonical author, and add `_comment`.   Need to ensure no data is lost when merging.

## Merge Editions

Current OL admin functionality.

https://openlibrary.org/books/merge 
takes parameters: `?key=OL..M&key=OL..M` etc

* Editions merge page: https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/merge/editions.html
* Plugin: https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/openlibrary/merge_editions.py

(TODO: Describe what is being done. Check for gaps)

## Merge Authors

Current OL admin functionality.

https://openlibrary.org/authors/merge
takes parameters `?key=OL..A&key=OL..A` etc
* Author merge page: https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/merge/authors.html
* Resulting page example: https://openlibrary.org/authors/OL...A/AuthorName?merge=true&duplicates=OL...A
* Author merge plugin: https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/upstream/merge_authors.py
Has `BasicMergeEngine` [class](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/upstream/merge_authors.py#L11) which could be reused.
* Plugin Tests: https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/upstream/tests/test_merge_authors.py

(TODO: Describe what is being done. Check for gaps)

## Merge Publishers
Feature request, see https://github.com/internetarchive/openlibrary/issues/372
Publisher is a string attribute, not a full entity, so this should be relatively straight forward to implement using the openlibray_client for a starter.
(TODO: describe merge process)