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

## Books( Works/Editions)
Add your idea here.


# FAQs
What is Wikidata?

It is similar to wikipedia in that it is crowdsourced but it provides structured and easy to query data about things. More in [this video](https://www.youtube.com/watch?v=m_9_23jXPoE) or [here](https://www.wikidata.org/wiki/Wikidata:Introduction).

Why do we want to use wikidata?
It give us access to rich structured data (such as biographical info, awards, and much more) to enhance the patron's experience.