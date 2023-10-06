@RayBB is in the process of building an integration between Open Library and Wikidata.

The current goal of this integration is to enhance the patron experience through author pages augmented with Wikidata. This will give 10,000s of author pages immediate access to profile pictures, birth/death dates (and location), short descriptions for disambiguation, awards, notable works, and potentially much more.

V0, which is in progress via [#8236](https://github.com/internetarchive/openlibrary/pull/8236) only adds the connection to start retrieving data (and showing a small sample infobox). After this is merged we will improve the infobox with other information and collect community feedback to prioritize next steps.

# Feature wishlist

## Authors
* Author autocomplete shows the "short description" from wikidata to help disambiguate
* Automatically download wikidata photos for authors with no photos
* Show wikidata photos as options in the author photo editor view
* Display link to wikipedia on author pages (bonus for linking in the user's language)
* Display link to author's official site
* Display links to Goodreads/Twitter/FB/Insta/LinkedIn/Amazaon/etc as the community would find worthy
* An option to search for books with authors born in a certain place
* Show some awards (tbd what is notable enough)
* Incorporate alternative names into solr search for authors
* Option to filter book search based on author's location, having a wikipedia page, date of birth, etc

### Author editing
* Show when there is a conflict between wikidata info and OL info about an author
* Prompt users to add wikidata ID
* Have autocomplete for wikidata id that searches and shows short descriptions
* Prompts to encourage the user to add edits to wikidata
* Warn users if OL ID in wikidata doesn't match the current author
* Incorporate wikidata notable works list into author merge tool

## Books (Works/Editions)
* Import book series from Wikidata like [A Song of Fire and Ice](https://www.wikidata.org/wiki/Q45875)
  * Or at the least we can show the next / previous book in a series based on wikidata
* Import from Wikidata awards like [NPR Top 100 Science Fiction and Fantasy Books (Q20899118)](https://tools.wmflabs.org/reasonator/?q=Q20899118&lang=en)
  * Photos/info about awards
* Import places associated with works/editions


# FAQs
**What is Wikidata?**

It is similar to wikipedia in that it is crowdsourced but it provides structured and easy to query data about things. More in [this video](https://www.youtube.com/watch?v=m_9_23jXPoE) or [here](https://www.wikidata.org/wiki/Wikidata:Introduction).

**Why do we want to use wikidata?**

It give us access to rich structured data (such as biographical info, awards, and much more) to enhance the patron's experience.

**What about bulk importing data?**

1. We are starting with live imports because we'll want a way to refresh the data frequently anyway.
2. We'll evaluate if we need a bulk import for authors that have wikidata IDs.
3. As far as importing wikidata entities that have OLID (but that OL doesn't have the wikidata ID set) we will have to be thoughtful about how we do that since there could be disambiguation issues. 

# Related Issues
- [710](https://github.com/internetarchive/openlibrary/issues/710) - some early ideas on this integration