Current query: https://openlibrary.org/search?q=title_suggest%3A%C2%A9+AND+ia%3A*&mode=everything

## Conversions

| mangled | correction | source |
|---------|------------|--------|
| `©♭`    | `é` (e-acute)   |
| `©`     | `à` (a-grave) OR `É`  | https://openlibrary.org/works/OL17679814W/Trait%C2%A9%E2%99%AD_%C2%A9%E2%99%ADl%C2%A9%E2%99%ADmentaire_d%27anatomie?edition=key%3A/books/OL26283189M  and https://openlibrary.org/works/OL36423630W/D%C2%A9%E2%99%ADmonstrations_%C2%A9%E2%99%ADl%C2%A9%E2%99%ADmentaires_de_botanique_%C2%A9_l%27usage_de_l%27%C2%A9cole_Royale_V%C2%A9%E2%99%ADt%C2%A9%E2%99%ADrinaire?edition=key%3A/books/OL49214802M|
| `©·`    | `è` (e-grave) ??!  | 
| `©Ł`    | combining grave |
| `©Ø`    | combing acute   |
| `©ʻ`    | combining cedilla | https://openlibrary.org/works/OL738281W/Trait%C2%A9%C3%98es_de_l%C2%A9%C3%98egislation_civile_et_p%C2%A9%C3%98enale?edition=key%3A/books/OL7074539M |
| `©·`    | combining umlaut ??! |
| `©ø`    | combining under-dot  | https://openlibrary.org/works/OL253565W?edition=key%3A/books/OL7178238M |
| `©Æ`    | combining bar ??     | https://openlibrary.org/works/OL253565W?edition=key%3A/books/OL7178238M |
| `Ã©`    | `é` (e-acute)                | https://openlibrary.org/works/OL24875145W/Trait%C3%83%C2%A9_d%27hygi%C3%83%C2%A8ne_publique_et_priv%C3%83%C2%A9e?edition=key%3A/books/OL33065425M |
| `Ã¨`    | `è` (e-grave)  | https://openlibrary.org/works/OL24875145W/Trait%C3%83%C2%A9_d%27hygi%C3%83%C2%A8ne_publique_et_priv%C3%83%C2%A9e?edition=key%3A/books/OL33065425M |
## Scale

Mangled `©♭` represents `é` (e-acute), there are other variations but e-acute is the most common form of this problem.

Looking for counts of mangled e-acute records in OL dumps:


    zgrep -c "\\\u00a9\\\u266" ol_dump_authors_2023-08-31.txt.gz
**Authors:** 1,542

    zgrep -c "\\\u00a9\\\u266" ol_dump_works_2023-08-31.txt.gz
**Works:** 8,974

    zgrep -c "\\\u00a9\\\u266" ol_dump_editions_2023-08-31.txt.gz
**Editions:** 11,486

I _think_ the MARC mangling in this way is reversible because the mangling is non-lossy. There _may_ be exceptions. I have a vague recollection that sometimes it is not fully reversible, but that could be another form of MARC mangling, and there are many.

The other issue first reported is of diacritic characters being dropped leaving a space, e.g. https://openlibrary.org/authors/OL4459814A/Heinrich_Schro_der
`Heinrich Schro der` for Heinrich Schröder.  This example does not have an archive.org scan, and does not appear to have a duplicate work or edition. It's unclear whether the author is duplicated or not since there isn't enough disambiguating info (i.e. dates or ids). 

    zgrep "[0-9]\s2008" ol_dump_authors_2023-08-31.txt.gz | egrep "[a-z] [a-z]" | grep -v "\\\u" | grep "[a-z] [a-z]"

exclude things like von / de , only search in name fields (bios give false matches)


Highlighting which mangled titles are associated with actual item scans for priority might be a good idea. Presumably mangled strings reducing the discoverability of viewable items has more of a cost that mangled strings affecting viewing of just the metadata record.


## Duplicate hypothesis:

The impact of these mangled titles is that the mangled authors/works/editions will be invisible to any matching algorithm (unless they can be matched by strong ids such as ISBN or LCCN -- EXPLORE FURTHER)

The consequence is that future dupes will not be matched and the un-mangled version will just be added as if it were a totally new record. That suggests that by now many of these mangled items will have been reimported correctly.

### Example:

https://openlibrary.org/authors/OL7244196A/Louis-Fr%C2%A9%E2%99%ADd%C2%A9%E2%99%ADric-Th%C2%A9%E2%99%ADodore-Albert_Rilliet

Louis-Fr©♭d©♭ric-Th©♭odore-Albert Rilliet

Louis-Frederic-Theodore-Albert Rilliet

Yes, duplicate author exists:

https://openlibrary.org/authors/OL7420280A/Louis-Fr%C3%A9d%C3%A9ric-Th%C3%A9odore-Albert_Rilliet

It looks like we have work dupes, but it's not so clear with editions (volumes and multiple scanned items may complicated this)


https://openlibrary.org/works/OL24879904W

Actually 3 vols -- 1,2 appear on the correct author, v3 appears on the mangled.

**POSSIBLE FIX:** merge mangled author and work + correct v3 and move under correct work.

b21495506_0003 (archive.org item only exists once in the editions data -- the item link is not a dupe)

This example is complicated by multiple volumes in a series and how those should be handled in terms of works.
It's possible the work should not be a dupe, but be a clearly marked V.3?

This is unlikely to happen through a MARC import since there is generally one MARC bibliographic record for a multivolume set.

For this example, the two works look to be technically dupe too but have imported separately by being in different languages.

Need some more examples.