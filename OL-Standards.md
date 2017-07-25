
### Location to publish standards
 * Wiki for technical / internal
 * OL Help -> FAQ 
 * OL Developers -> Developer Center



### Things to standardise

* Titles (Title Case / other?)
* Subtitle rules and field splitting
*Author name (OL uses "natural order") How to handle initials / full name vs. commonly know as, aliases and pen-names.   Books of an author published under different names is meaningful in many (most?) cases.

* Roles, Multiple Authors, Editors, Illustrators etc

* Subjects: authority, case, special tags

* Formats: Hardcover / Softcover -- many synonyms

* Dimensions / weight etc... link to external librarianship standards?

* ISBNs, fields (10, 13 + other), validation

* Dates (currently free text, I have found at least one example of asian dates with kanji month and day) .   Approximate dates?

* External links:  special wikipedia field, VIAF, Wikidata
confusion over amazon and IA ids where users sometimes paste URLs instead of ids.

* Allowable fields in OL records, currently there can be free fields on records, do we want this / how to manage it if we do?

* Which things are arrays, should they be? i.e. an edition's 'works' is an array, but no edition has more than one(?) Same with 'publishers'

* Field standards, some keys are `named-key: {type/value}` [last_modified, created], others `named-key: value [isbn_13, publish_date]`, and others `named-key: {key: value}` [type]

* Clarity of why and which, document and explain for users + check consistency when adding new fields.

* Unicode -- NFC.. what are the implications for search? Define expectations and create some tests for Solr behaviour?

* Other -- please add

