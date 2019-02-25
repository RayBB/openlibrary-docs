# Introduction

Are you frustrated with the number of metadata mistakes on OpenLibrary editions, works, authors, etc? Do you notice the same problem happening over and over? Are you seeing a lot of duplicate Authors which should be merged or fake books which should be deleted? Are there books missing from OpenLibrary that you'd like to import from other sources? These are jobs for [`bot accounts`](https://openlibrary.org/dev/docs/bots).

OpenLibrary `bot accounts` are used to make http POSTs to work, author, edition, subject, etc., pages in order to correct metadata or create/import new records (e.g. books, authors, bookcovers) in bulk. 

# Applying for a `bot account`

Follow these 2 steps to apply for a privileged `bot account`:
1) First, [register a new OpenLibary account](https://openlibrary.org/account/create) which meets the following guidelines: (a) Your `bot account` should be **different** from your personal OpenLibrary account and (b) the username of your new account should end with the word "Bot" (e.g. `WorkBot`, `ImportBot`). These conventions allow us to [monitor / filter through `Recent Changes` by `bot`s](https://openlibrary.org/recentchanges#bots) to identify only those changes made by `bot account`s. (Since bots tend to repeat the same small operation with high frequency, they would overwhelm the list if shown alongside edits by humans.)
2) Open a github issue and ask a site `admin` (e.g. @mekarpeles or @hornc as of 2019) to set your account to have `bot` privileges and to [add your account to the `"API" usergroup`](http://openlibrary.org/usergroup/api?m=edit)

# Getting Started: Rules

**Question** Great, I now have a bot account, I can start fixing thousands of problems I've noticed, right?

**Answer** Hold on! After you have been granted bot access, *please do not* run a bot script to change metadata in bulk (for more than 100 records) until it has first been reviewed by @charles. The right process is to create a new directory for your bot within the https://github.com/internetarchive/openlibrary-bots repository, to open a PR, and to add @charles (@hornc on github) or myself (@mekarpeles on github) as the reviewer. 

***

**Question** I have a metadata question about how my bot should work, a question about using the openlibrary-client, or I need a code review for my bot. Who do I ask?

**Answer** @hornc (@charles on slack) is our lead on metadata and is a great person to answer questions about the `openlibrary-client` and writing/registering `bots` to fix metadata or add new books to our catalog

***

**Question** I have written a bot, am I ready to run it?

**Answer** If you have written a bot script and think it's ready to be run, the correct procedure is to fork the https://github.com/internetarchive/openlibrary-bots repository, create a new branch for your bot, add a directory in the project named according to the action your bot will perform, and then submit a PR (pull request) for review. Please don't run bulk modifications until @horn or @mekarpeles have reviewed and approved your script or your bot privileges may be revoked.

*** 

**Question** My bot reads metadata from a source file and then modifies records on Open Library -- should these source data files be saved somewhere?

**Answer** Yes please -- If you are writing a bot to add new or updated metadata to Open Library from a file(s), those files should also be committed with your script to https://github.com/internetarchive/openlibrary-bots

# `openlibrary-client` Library

Instead of making POSTs to API endpoints directly using a `bot account`, the OpenLibrary community has created an official python client library called [`openlibrary-client`](https://github.com/internetarchive/openlibrary-client) which streamlines the process of making metadata updates and writing `bot`s. `Bot`s used to be written using the http://github.com/internetarchive/openlibrary/blob/master/openlibrary/api.py library, but this has been deprecated in favor of the much easier (and safer) `openlibrary-client`.

- [Click here for instructions on installing and using the openlibrary-client](https://github.com/internetarchive/openlibrary-client).

# `Bot account` Etiquette 

If possible, `bot accounts` **should not** be used directly to make 1-off changes, e.g. from the command line. Changes instead should be coded into `bot scripts` (i.e. `bot`s) and checked in to the [openlibrary-bots](github.com/internetarchive/openlibrary-bots) repository. This way we can look back in time and see/figure out what exact changes were made (so we can debug if something goes wrong or if we have to modify or update and re-apply the logic).

# Example `Bot`s

[Here's an example by @hornc of a `bot` which uses `openlibrary-client` for merging works/editions and updating records in bulk](https://github.com/hornc/catharbot).

The following are **legacy examples** which used `api.py` (which is deprecated) instead of `openlibrary-client`, but they give an idea of what OpenLibrary `bot`s are, what they do, how they are written, and how they are used. Please refer to the [openlibrary-client documentation](https://github.com/internetarchive/openlibrary-client) for more modern examples:

- [Daniel's IdentifierBot](http://github.com/dmontalvo/IdentifierBot/blob/master/fastadder.py)
- [Ben's Goodreads bot](https://github.com/internetarchive/openlibrary/blob/master/scripts/2010/04/import_goodreads_ids.py)
- [AMillarBot](http://openlibrary.org/people/AMillarBot)
- [oclcBot, by Bruce Washburn](http://openlibrary.org/people/oclcBot)

# `Bot` Opportunities

**Legend**
- A: Authors
- E: Editions
- W: Works

## Unicode [A, E, W]

  * 'mojibake' A~(c) style encoding errors. 
    From multiple sources
      - Some from Amazon bulk imports
      - Some from external MARC records
    Some are lossy, others can be reconstructed.
    Important point to note: there are multiple styles that look similar, but require
    different translation to fix.

  * Combining diacritics (Github issue https://github.com/internetarchive/openlibrary/issues/150 )
      -Some external MARC records have had subsequent correction, reimportation could catch many such cases
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
Needs checking. Some url ids appear to resolve correctly. Suspicion that some users are trying to insert affiliate links in OL ids. What is our policy on this? Should we be making more effort to ensure only Internet Archive affiliate links are used?

## Invalid ISBNs [E]
  _10 and _13
  Other ISBN fields; can they be used for anything?
  * repair if possible
  * normalise
  * remove if bad
  * test for reuse on multiple editions

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

## Titles varied _only_ by punctuation or whitespace [E, W] (where author is the same)
  * remove trailing ".", ":", ";"
  * reduce whitespaces to single sp
  * when one version has a single sp and another has no sp, change latter to single sp (e.g. Hitchhiker's guide --> Hitch hiker's guide)
  * when one version has embedded punctuation and another does not, change latter to match former (e.g. Hitch hikers guide --> Hitch-hiker's guide)

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
If there was some way to go back to the the original edition move and complete the work redirection? Perhaps the WorkBot log at  https://github.com/internetarchive/openlibrary/blob/629f2afe8fbff9e8af50e00a57e756dff45a0d73/openlibrary/catalog/works/live.py#L438 might be helpful??

## Editions unlinked to works
Appears to occur mainly with apparently editionless works. How common is it? If rare, it should be fairly simple to address manually in librarian mode given a list of such editions.

## Authors without Works [A]

## Orphaned editions without Authors [E]
Where author is known to IA, from MARC records. Update the records from the original MARC. Many of the missing authors seem to be on books that have editors rather than striaght authors. Is this a cause of the problem? How to correctly represent editors on Open Library works?

## Non-Book items [A, E, W]
There were 54,000 bad author records associated with Audio CD imports, see github issue https://github.com/internetarchive/openlibrary/issues/152
Each author was linked to at least one edition, and often a work. Many of these records happened to be editions without works as the bulk were imported in 2008, from Amazon, when these sort of data issues were common. Most are now corrected.
