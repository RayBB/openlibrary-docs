Best practices were discussed at http://webservices.itcs.umich.edu/mediawiki/oaibp/index.php/IdentifyingTheResource although that site has been frozen since, in mid-2007, the DLF was reabsorbed into the CLIR to form https://www.diglib.org. Not sure where current best practices abide.

- oclcid - OCLC ID
- lccn - Library of Congress ID
- olid - Open Library ID (e.g. OL123W, OL234M, etc)
- ocaid - Open Content Alliance ID (i.e. Archive.org item identifier)
- htid - Hathi Trust ID (c.f. https://www.hathitrust.org/data )


# Open Library identifiers on Archive.org

Back in the day, we used to connect Archive.org <=> OpenLibrary.org items using a metadata field called `openlibrary` on Archive.org and a field called `ocaid` on OpenLibrary.org (which stands for `Open Content Alliance ID` — see: https://en.wikipedia.org/wiki/Open_Content_Alliance).

@mek noticed these `openlibrary` IDs were very stale and had not been used for a while. So 2 new fields were added (in attempt to deprecate `openlibrary` field on Archive.org). These are `openlibrary_edition` and `openlibrary_work`.

If I recall @hank and @judec informed me the `openlibrary` metadata key is actually being used in certain places within our derive pipelines — this code has never been updated to use `openlibrary_edition` and `openlibrary_work`.

## Retrieving Archive.org data for an Open Library identifier

For any given `openlibrary_edition` one should be able to use this ID pull the MARC from Open Library to confirm if the metadata matches. Or even more easily — let’s say you have a book on archive.org called… `jungleauthoritat00sinc`

And its metadata lists its `openlibrary_edition` as `OL3561303M`.

If you use https://openlibrary.org/books/OL3561303M.json it will return the json API data for that book and you can check the values without necessarily even needing the MARC