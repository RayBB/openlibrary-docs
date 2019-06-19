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

# OpenLibrary

    covers: [253146],
    ocaid: "jungleauthoritat00sinc",
    key: "/books/OL3561303M",
    identifiers: {
      goodreads: ["54855"],
      librarything: ["3414"]
    },
    lccn: ["2002026536"],
    isbn_10: ["039397779X"],


# Archive.org identifiers

    <isbn>9780393977790</isbn>
    <isbn>039397779X</isbn>
    <openlibrary>OL3561303M</openlibrary>
    <external-identifier>urn:asin:039397779X</external-identifier>
    <external-identifier>urn:acs6:jungleauthoritat00sinc:pdf:0c7cfd74-4178-4606-aad6-82c7dd226004</external-identifier>
    <external-identifier>urn:acs6:jungleauthoritat00sinc:epub:e2b0f076-2d77-44b4-bbbd-75e14c654c2c</external-identifier>
    <external-identifier>urn:oclc:record:1035882283</external-identifier>
    <boxid>IA1138320</boxid>
    <identifier>jungleauthoritat00sinc</identifier>
    <containerid>S0022</containerid>
    <identifier-access>http://archive.org/details/jungleauthoritat00sinc</identifier-access>
    <identifier-ark>ark:/13960/t9n33ns5x</identifier-ark>
    <oclc-id>473022932</oclc-id>
    <oclc-id>492015570</oclc-id>
    <oclc-id>50143929</oclc-id>
    <oclc-id>611841594</oclc-id>
    <oclc-id>750905675</oclc-id>
    <oclc-id>845516453</oclc-id>
    <oclc-id>849008372</oclc-id>
    <lccn>2002026536</lccn>
