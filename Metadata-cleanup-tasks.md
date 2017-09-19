
## Unicode [A, E, W]

  * 'mojibake' A~(c) style encoding errors. 
    From multiple sources
      - Some from Amazon bulk imports
      - Some from external MARC records
    Some are lossy, others can be reconstructed.
    Important point to note: there are multiple styles that look similar, but require
    different translation to fix.

  * Combining diacritics (Github issue https://github.com/internetarchive/openlibrary/issues/150 )

  * NFC Normalisation. Of titles, description, place, i.e. all text fields.
    Ensure all input mechanisms normalise correctly. UI + import paths. TEST.


## Spaces in OCAIDs [E]
  Github issue https://github.com/internetarchive/openlibrary/issues/467
  Outstanding items (ocaids with spaces) listed [here](https://docs.google.com/spreadsheets/d/1dAN94_7VBuFOj8qgrL77FyQNfuaBx23O_2_zq9Lo4LI/edit#gid=1674457106)
  Check importbot does not create more.
  Add input validation to UI. [PR](https://github.com/internetarchive/openlibrary/pull/565)

## URLs in OCAIDs [E]
  Not many?

## URLs in Amazon ids [E]
  Needs checking. Some url ids appear to resolve correctly. Suspicion that some users are trying to insert affiliate links
in OL ids. What is our policy on this? Should we be making more effort to ensure only Internet Archive affiliate links are used?

## Invalid ISBNs [E]
  _10 and _13
  Other ISBN fields; can they be used for anything?
  * repair if possible
  * normalise
  * remove if bad

## Invalid / incorrect other ids [E, W]
  * Identify cases
    - LCCN
    - OCLC
    - LibraryThing ids, (should be Work level?) see github issue https://github.com/internetarchive/openlibrary/issues/497
    - other

  * Fix
  * Sometimes the ids are valid, but link to a different book. How to resolve?
## Empty Titles [A, E, W]?
  * repair if possible
  * delete if junk data

## Name Order [A]
  The Open Library convention is natural name order as opposed to "Last, First"
  Is everyone happy with this standard? How should titles be handled? e.g. Sir , Lord, Lady, Mrs. There seems to be variation in the data for this style of name.

Also, how to handle Aliases? I notice the author_role type https://openlibrary.org/type/author_role has an 'as' property. Is this to allow for name variations on a particular book?

## Bad alternate names for authors [A]
Github issue https://github.com/internetarchive/openlibrary/issues/498

  * Fix

## Orphaned Editions
  Github issue https://github.com/internetarchive/openlibrary/issues/153
  see plan for 5M Orphans

## Works without editions [W]
https://github.com/internetarchive/openlibrary/issues/44
Appears to be a merging task now. These editionless works look to be left over from moving editions (translations are a common example) to another work without converting the original work to a redirect.
If there was some way to go back to the the original edition move and complete the work redirection?

## Authors without Works [A]

## Orphaned editions without Authors [E]
  Where author is known to IA, from MARC records. Update the records from the original MARC. Many of the missing authors seem to be on books that have editors rather than striaght authors. Is this a cause of the problem? How to correctly represent editors on Open Library works?

## Non-Book items [A, E, W]
There are 54,000 bad author records associated with Audio CD imports, see github issue https://github.com/internetarchive/openlibrary/issues/152
Each author is linked to at least one edition, and often a work. Many of these records happen to be editions without works as the bulk were imported in 2008, from Amazon, when these sort of data issues were common.
