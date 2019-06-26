
In order for Open Library users to access readable and borrowable books from archive.org, the respective data records need to be correctly synchronised.

This page documents the specific and technical requirements, and lists potential challenges to keeping the records synchronised.

## Significance

At of 2019-06-24, 60,000 books were in our `inlibrary` lending program but not available through Archive.org. That is about 6% of our entire catalog which is not borrowable through Open Library. There are another [281k books](https://archive.org/search.php?query=collection%3Aprintdisabled%20AND%20-openlibrary_edition%3A%2A%20AND%20-openlibrary%3A%2A%20AND%20isbn%3A%2A%20AND%20format%3AMARC%20AND%20%21collection%3Ainlibrary) (excluding `inlibrary`) in `printdisabled` which have isbns and MARCs and are not on Openlibrary.org. Without linking up archive.org and open Library we also lose out on the ability to reliably determine the availability of our works. We have chosen now as the time to work on this project because over the past months we have eliminated hundreds of thousands of orphaned additions which was a prerequisite to this project. Successful IA ↔ OL sync also means a revitalized import process which is more effective at importing internet archive works moving forward.

## Existing fields

### archive.org items
 * `openlibrary_edition`, format example: `OL12345M`, creates a link from the item's details page to the exact Open Library edition represented by this scan.
 * `openlibrary_work`, format example: `OL12345W`, creates a link from the item's details page to the Open Library work that groups other editions of this scan.
 * `openlibrary`, format example: `OL5189756M`, a now **DEPRECATED** reference to an Open Library edition. Potentially used in the archive.org scanning process to locate MARC records, and in Open Library import code as a short cut for matching existing records. Both uses need to be investigated and updated to use the newer fields above.

### Open Library Edition level metadata
 * `ocaid`, format example: `callofdistantmam00ward` This is the primary useful link back to an archive.org item. It only stores one value, so there is an issue when there exists multiple scans of an edition on archive.org. Only one is linked from OL to IA, even though multiple IA items may refer to the same edition. The current OL sync process only automatically updates the archive.org item present in this `ocaid` field. 
 * `source_records`, format example: `["ia:callofdistantmam00ward", ...]`

Other less common IA related fields, possibly to be deprecated?:
 * `"ia_box_id": ["IA113601"]`
 * `"ia_loaded_id": ["callofdistantmam00ward"]`

**Note** All fake-subject references to archive.org categories that may have once been used for classifying borrowable status are now deprecated. Examples: `In Library`, `Protected DAISY`, `Accessible_book`, `Internet Archive Wishlist`, `Lending library` and possibly others. [Issue #2107](https://github.com/internetarchive/openlibrary/issues/2107) tracks this clean up.  

See [Open Library Client JSON schemata](https://github.com/internetarchive/openlibrary-client/tree/master/olclient/schemata) for the currently recognised and useful metadata fields for Open Library records.

## Technical requirements

* All archive.org book items with a populated `openlibrary` metadata field should also have `openlibrary_edition`.
  * [CRITERION NOT MET QUERY](https://archive.org/search.php?query=mediatype%3Atexts+AND+openlibrary%3A%2A+AND+NOT+openlibrary_edition%3A%2A): `mediatype:texts AND openlibrary:* AND NOT openlibrary_edition:*`
  * Possible issue: just because an item has an old `openlibrary` field does not neccesarily mean it should be on OL if it doesn't meet the other criteria listed on this page.

  * Total @ June 2019: 25,190

  * Breaking this category down further into other categories listed further down:

     * [In Library](https://archive.org/search.php?query=mediatype%3Atexts%20AND%20openlibrary%3A%2A%20AND%20NOT%20openlibrary_edition%3A%2A%20AND%20collection%3Ainlibrary): `mediatype:texts AND openlibrary:* AND NOT openlibrary_edition:* AND collection:inlibrary` 
       * 14,878 items In Library without openlibrary_edition that have openlibrary.
       * spot checks: https://archive.org/details/cavalierinwhite00mull_cc9 and https://archive.org/details/bostonaccess00wurm_0 -> listed OL item points to a different IA scan

    * [Open collection](https://archive.org/search.php?query=mediatype%3Atexts%20AND%20openlibrary%3A%2A%20AND%20NOT%20openlibrary_edition%3A%2A%20AND%20NOT%20collection%3Aprintdisabled%20AND%20NOT%20collection%3Ainlibrary): `mediatype:texts AND openlibrary:* AND NOT openlibrary_edition:* AND NOT collection:printdisabled AND NOT collection:inlibrary`
      * 6,801
      * Following an example, we have two ia scans https://archive.org/details/annalenderphysi249unkngoog https://archive.org/details/bub_gb_xAQ4AAAAMAAJ an 1833 and an 1803 edition, which both point (using different fields) to a 1900 Open Library edition, further complicated because this item is a serial
      * This category needs to be filtered down -- to only include open items in known good collections Filtering these down to items in the `americana` and `internetarchivebooks` shows that most of those remaining are early serials that get excluded from the latest import criteria.

     * [Printdisabled only with ISBN](https://archive.org/search.php?query=mediatype%3Atexts%20AND%20openlibrary%3A%2A%20AND%20NOT%20openlibrary_edition%3A%2A%20AND%20NOT%20collection%3Ainlibrary%20AND%20collection%3Aprintdisabled%20AND%20isbn%3A%2A):`mediatype:texts AND openlibrary:* AND NOT openlibrary_edition:* AND NOT collection:inlibrary AND collection:printdisabled AND isbn:*`
        * 3,124

     * [Printdisabled only without ISBN](https://archive.org/search.php?query=mediatype%3Atexts%20AND%20openlibrary%3A%2A%20AND%20NOT%20openlibrary_edition%3A%2A%20AND%20NOT%20collection%3Ainlibrary%20AND%20collection%3Aprintdisabled%20AND%20NOT%20%20isbn%3A%2A):`mediatype:texts AND openlibrary:* AND NOT openlibrary_edition:* AND NOT collection:inlibrary AND collection:printdisabled AND NOT isbn:*`
        * 387 items
        * The collections that seem to signify these items without ISBNs are good books are `internetarchivebooks` and `americana` -- the criteria for non-lendable books below should be updated to include these pre-isbn books that are likely to have good metadata.


* All archive.org book items with `openlibrary_edition` **MUST** have `openlibrary_work`, and vice versa.
   * [CRITERION NOT MET](https://archive.org/search.php?query=mediatype%3Atexts%20AND%20openlibrary_edition%3A%2A%20AND%20NOT%20openlibrary_work%3A%2A): `mediatype:texts AND openlibrary_edition:* AND NOT openlibrary_work:*`
   * [CRITERION NOT MET](https://archive.org/search.php?query=mediatype%3Atexts%20AND%20openlibrary_work%3A%2A%20AND%20NOT%20openlibrary_edition%3A%2A): `mediatype:texts AND openlibrary_work:* AND NOT openlibrary_edition:*`

* Openlibrary identifiers on archive.org should only be on `mediatype:texts` items as only books should be represented on Open Library.
  * [CRITERION NOT MET](https://archive.org/search.php?query=openlibrary%3A%2A%20OR%20openlibrary_edition%3A%2A%20OR%20openlibrary_work%3A%2A%20AND%20NOT%20mediatype%3Atexts) `openlibrary:* OR openlibrary_edition:* OR openlibrary_work:* AND NOT mediatype:texts`
  * Some items not meeting this technical criterion may be legitimate. Some items appears to be gallery catalogs (i.e. books) that are linked to `mediatype:image`, and other archive.org items could be legitimate books that are mis-categorised. @ June 2019 there are 55 items matched above. Each item needs to be examined to find the fix, or at least to come up with a set of fix categories. Simply deleting the linking metadata would be incorrect in many of these situations as the links are probably a sign of further data issues on OL or IA.

* All borrowable `collection:inlibrary` books should have `openlibrary_edition`:
  * [CRITERION NOT MET](https://archive.org/search.php?query=collection%3Ainlibrary%20AND%20NOT%20openlibrary_edition%3A%2A): `collection:inlibrary AND NOT openlibrary_edition:*`
  * As of June 2019 there are 60K archive.org items that do not meet this condition.
    * ex 1: has no MARC so wasn't imported: https://archive.org/details/nairobigrit
             TRY FIX:  import with require_marc = False

    * ex 2: https://archive.org/details/buildingvirtuall0000unse  has MARC, also on OL, but OL record points to non-lendable copy
             TRY FIX: re-import, should update ocaid.    If import adds an ia source record, it should also update the ocaid!!!!  

     * ex 3: https://archive.org/details/isbn_9781481758765  has MARC -- simply not yet imported
             TRY FIX: import from MARC

* archive.org print disabled collection items representing _books_, which are not necessarily borrowable by users without print disabilities, should have entries on Open Library to capture the existance of a book we know about, and aid discovery by print disabled users. The following query uses the presence of an ISBN as an indicator that an item is a book with sufficient metadata to count as good for importing.
  * [CRITERIA NOT MET](https://archive.org/search.php?query=collection%3Aprintdisabled%20AND%20NOT%20collection%3Ainlibrary%20AND%20NOT%20openlibrary_edition%3A%2A%20AND%20isbn%3A%2A): `collection:printdisabled AND NOT collection:inlibrary AND NOT openlibrary_edition:* AND isbn:*`
    * **note** the number of items resulting from this query will depend on user account privileges, and not all users will see all print disabled only items by default on archive.org. @ June 2019, there are 330K items in the maximal list that are not linked to Open Library.
    * [Existing issue #1047](https://github.com/internetarchive/openlibrary/issues/1047)

* The following query attempts to locate items that are printdisabled only, do NOT have ISBNs in metadata, but are good scanned books `collection:printdisabled AND NOT collection:inlibrary AND NOT openlibrary_edition:* AND NOT isbn:* AND collection:internetarchivebooks` there are 13,708 results, but most appear to have incomplete titles ... strangely _with_ ISBNs in the title field. It looks like these have stalled in the scanning process somehow?

## Orphaned items with ocaid

remaining total @ 26 June 2019: 38347

NONE are duplicated

### re-running re-import process

20730 were successfully matched or had works created, fixing the orphan (54%)

316 were matched on a _different_ existing edition.
**!!FIX for these:**  get orphan by opening https://openlibrary.org/books/ia:<ocaid> and then associate it with the matched work.

the remaining 17301 were not resolved due to the following issues:

* bad-repub-state: -- Need advice from Andrea or Jude. Repub state 6 is micro-film.
  * 5927
* invalid-ia-identifier: -- Consider wiping invalid IDs. These should get repaired if the archive.org item is reimported.
  * 209
* invalid-marc-record: -- ignore for
  * 43
* item-is-serial: -- investigate for quick way to match existing (if possible) otherwise, create the works.
  * 9766
* item-not-book: -- needs further, possibily delete?
  * 754
* no-imagecount: -- delete 
  * 41
* noindex-true: -- delete
  * 470
* not-texts-item: -- a BWB protodonation item to be fixed manually
  * 1

**Proposal:** the `no-imagecount` and `noindex-true` OL orphans should simply be deleted. They tend to have been created from problematic archive.org records that we would not currently import, and the main reason for the no-index flag appears to be mismatched metadata, or otherwise bad scans. The records I have checked all seem to have better non-broken scanned items elsewhere, and have been imported properly via those.