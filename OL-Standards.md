
### Location to publish standards
 * Wiki for technical / internal
 * OL Help -> FAQ 
 * OL Developers -> Developer Center



### Things to standardise

* Titles (Title Case / other?)
** need to capture original-language titles and edition-language titles, usual English rules for Title Case are often not applicable in other languages. Sentence case generally is, plus it is much easier to read. 
* Subtitle rules and field splitting

*Author name (OL uses "natural order") How to handle initials / full name vs. commonly know as, aliases and pen-names.   Books of an author published under different names is meaningful in many (most?) cases.
** rather than reinvent the wheel, adopt either ISNI or VIAF identifier once found

* Roles, Multiple Authors, Editors, Illustrators etc

* Subjects: authority, case, special tags

* Formats: Hardcover / Softcover -- many synonyms

* Dimensions / weight etc... link to external librarianship standards?
** Source metadata may simply give 8vo, or inch-measure. Should auto-convert to approximate cm for consistency, i18n.
* ISBNs, fields (10, 13 + other), validation
**A huge number of bogus ISBNs were created from bad amazon records in 2008, these should be stripped or at least downgraded to ASINs if they cannot be validated

* Dates (currently free text, I have found at least one example of asian dates with kanji month and day) .   Approximate dates?
**It's the year that matters for copyright, that has to be consistent. Month and day are useful for disambiguation of editions.

* External links:  special wikipedia field, VIAF, Wikidata
confusion over amazon and IA ids where users sometimes paste URLs instead of ids.
**Many of the other ids are also mishandled in the current UI (e.g. BNF). A preview would help. Whether the URL or just the basic id is the input, the full URL ought to be resolved and validated at edit time. 

* Allowable fields in OL records, currently there can be free fields on records, do we want this / how to manage it if we do?

* Which things are arrays, should they be? i.e. an edition's 'works' is an array, but no edition has more than one(?) Same with 'publishers'
**Allowing more than one work record per edition might be a helpful step towards merging them. Alternately allow the various work records to link back to the oldest (or per WorldCat's algorithm to the smallest-valued identifier)

* Field standards, some keys are `named-key: {type/value}` [last_modified, created], others `named-key: value [isbn_13, publish_date]`, and others `named-key: {key: value}` [type]

* Clarity of why and which, document and explain for users + check consistency when adding new fields.

* Unicode -- NFC.. what are the implications for search? Define expectations and create some tests for Solr behaviour?
** for searches and type-ahead behaviours must use case-insensitive, diacritic-insensitive matching 

* Other -- please add

