# Table of Contents

- [Week 1: 2017-03-08 Community Call](#week-1-2017-03-08-community-call)
- [Week 2: 2017-03-15 Community Call](#week-2-2017-03-15-community-call)

# Week 1: 2017-03-08 Community Call

Attendees:
- @mek, @charles

## Blocking problems

@mek needs to fix vagrant researcher VM to work w/ updated auth; login w/ email

## Discussing Q2 and Q3 Roadmap

See: https://github.com/internetarchive/openlibrary/wiki/Roadmap

Note:
- Charles needs a bot with admin access
- Current git has to our openlibrary page (dev) -- what version are we running? (use git tag)
- @skylerbunny's PR for prioritizing oclc > isbn
- David and charles access to VM for MARC record parsing

cares about pre-1600 books

What are we missing from being a good authoritative source of data?
- general librarianship (no standard) -- standard geographical location [early books, foreign language books] -- English is the language of metadata
- supporting multiple languages (accurate records)
- allow upload on Open Library?... (to archive.org)
- ask partners for title page scans (from partners) + book covers
- Wing numbers as an identifier 
- Grouping by publisher -- use subject "publisher"

openlibrary-g works better than open library mailing list

Opportunities:
- Author merges

Let's create a button for:
[books I own | books I've read | books I want]
private lists which are private

Stack-overflow for Open Library
Wikipedia - every page [Work] has a discussion section

## Ideas
Subscribe to changes on pages
A user chat page or messaging
Badges and karma for librarians (discogs.com has this) [gameify]
- number of edits
- works added
- librarian badge
- genre bags
- how many books you've read

How do we surface the style guides for Open Library?

Standards document:
- auto validation on a title (warning of data is invalid)

Like wikipedia, have a banner which shows which pages need 
flag desired data as missing -- request a change
How can users request they want to know a field? !!!

# Week 2: 2017-03-15 Community Call

Updates:
1) Vagrant Fixes (auth)
2) Removed link to kindle download (broken)
3) Bots & admin features
4) Metadata prep for @dvd
5) OPDS this week
6) TODO: fixing Lists (works shows 0 editions)

Folks:
- Nicholas (ios, product; wants redesign)
- Irene (product, business)
- David (book metadata, search, systems)
- Brenton, Mek (OL)

Todos, opportunities, and blockers:
1) Getting David access to MARCs, the metatools repo, and a very short overview of the tools / process
2) Getting @nicholaskinloch and @irenem access to data (happy to do an in person google analytics session, or see what we need to do in order to get the data y'all need)
3) Following up with @charles about administrative metadata features (possibly updating openlibrary-client to have special functions for `bot` users, like work merge)
5) Following up with David re: List bug (Works show 0 editions)
6) Getting a design group together + making Open Library responsive
7) Entertaining the idea of letting users answer questions / customize their accounts (e.g. location, age, etc) to help with recommendations
8) Catching up w/ @skylerbunny to identify other problems/bugs of interest

# Week 3: 2017-03-21 Community Call

Time: Tuesday, 10:30am PDT
Attendance:
- brenton
- skylerbunny
- charles
- nicholas
- mek

## Updates

**Charles**
- Has been using APIs to create bots to address data quality
- Found a way to delete works (e.g. audio works which shouldn't exist on OL)
- Question: Will deleting a work via API (w/ editions) will fail?
- Detected bad Author merges
- Recaptcha2; wants to allow people to more easily edit

1) [Endpoints](https://github.com/internetarchive/openlibrary/wiki/Endpoints) - contributing to document obscure endpoints (seeing which new APIs we need to build)
2) Administrative Document - documenting processes & practices for merging works, etc.
3) Updating openlibrary-client
4) Cross-Linking Authors & Works (VIAF, Wikidata, OL) w/ David

**Skyler**
- Cares about the mission 1-web-page-per-book
- Partner w/ Charles on discovering user issues and metadata opportunities

**Mek**
- Completing rollout of repaired OPDS
- Looking for designers to help w/ beta branch (separating FE and BE)

# Week 4: 2017-03-28 Community Call

## Agenda

- Updates: What did we get done this week? What is currently in progress?
- Blockers: What do we need the community's feedback on?
- Meetings: What meetings need to occur?

## Attendees

Mek, Charles, Neal, Brenton, Bernat, David

## Updates

### Charles

Aggregating list of (unofficial) endpoints. Documenting merging strategy
Question about bulk upload API? Does it exist?

### Bernat

Welcome! Bernat is working on a mentorship mobile app.
Suggests react + less, would like overview of feature/beta branch

### David

Open Book genome project. Improving data we have: Using openlibrary-client tool, metatools, librarything
- Metadata format

### Neal

Was originally downloading warc files -- give me all pdfs
researcher vm w/ batch of pdfs on them

### Brenton

### Mek

- Met with Jean Saung about service design (creating an ecosystem diagram for Open Library) https://docs.google.com/a/archive.org/document/d/1RUsUnIJM78gTr5ycewUJNwYHERBQdg_Tv-X-OZpwtRY/edit?usp=sharing
- (PR in progress) Added remote_ids: wikidata, VIAF, and librarything IDs to author edit page
- Mek will write script to ingest 90k Author records and link them to wikidata + VIAF
- Worked on experimental mobile design for OL + started an experimental front-end which uses existing APIs to createaa combined works & editions page concept
- Openlibrary-client -- created librarything API (xisbn) (tool for @dvd and @charles)

## Meetings

- Nicholas, Irene, Mek, Bernat, Jean, Brenton -- some subset of this group should meet or contribute to the ecosystem diagram (it would be great if Jean can describe the purpose of this doc; I'll do my best)

# Week 5: 2017-04-04 Community Call

## Agenda

1. Review Roadmap
2. Updates & Progress
- VIAF, Wikidata, OLID (Done)
- Fixing book importing (IA -> OL)
- Adding subject tags to works & indexing in solr
- Redesign content ideas
- Merging works & editions

3. Todo
- Fixing List Works


## Charles

Is there an authority for subjects (Library of Congress), LibraryThing. cc: @dvd

## Nicholas

Going to contribute to design doc

## Mek

Share design doc w/ #openlibrary-g and Nicholas
How do we get subjects added to works and into solr?

# Week 6: 2017-04-11 Community Call
# Week 7: 2017-04-18 Community Call
# Week 8: 2017-04-25 Community Call
# Week 9: 2017-05-2 Community Call
# Week 10: 2017-05-9 Community Call
# Week 11: 2017-05-16 Community Call
# Week 12: 2017-05-23 Community Call