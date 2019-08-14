## Goals
Here is a list of generally expressed goals for importing:
* More imported books
* Quality imports
* Newer, more recent books
* More useful items, what are our users searching for and not finding?
* Ongoing, automated pipeline so OL stays current
* Flexible, extensible import process that can import a wide range of available and new data sources
* Synchronisation with current and potential data partners (BWB, Wikidata, etc.)

These are high level areas. To make concrete progress we need to identify some specific goals, collect some data, identify tradeoffs, and prioritise between these categories, then break down into specific tasks.

## Metrics
In order to measure progress and gaps, we need some metrics...
### Basic starting point -- where are we?
* How many books are we currently importing now and over the recent past?
  * graph imports per month using `add_book` query?
  * Extra details:
     * Split by source, user added vs. bot added, MARC import, ISBN import
     * Distribution by published date for current imports and sources
* What is the current distribution of published dates in Open Library?
  * TASK: create a script to extract this data (for graphing) from a monthly ol_edition dump.
* What is being searched for and not found by users?
* Overlap stats with partner data (needs requirement details)

## Sources of import metadata
* Libraries, MARC data
  * PROs:
    * Better metadata
    * More detail
    * Author distinction with dates
  * CONs:
    * Tend to be older books... primarily because we are not actively seeking new dumps? SFPL was the most recently extracted catalog imported (https://archive.org/details/marc_openlibraries_sanfranciscopubliclibrary).
* Booksellers, ISBN lookup
  * PROs
    * Newer books, incentive to keep up, market driven, popular modern books emphasised.
  * CONs
    * Lighter metadata
    * Frequently include notebooks and other products with ISBNs for sale that we might want to exclude
    * Frequently include non-book products with other identifiers (or incorrectly converted data in ISBN field) in their catalogs
    * Bookseller catalogs are not concerned with overall catalog coherence or quality -- maximising sales goal not impacted by junk metadata entries. Offer it for sale even if it does not make sense. We OTOH want _ALL_ items to be coherent.

IDEA: Define a bookseller metadata quality threshold. Heuristics to decide whether we want to import a record?

## Quality issues
* Duplicate records (Author, Work, Edition)
* Conflated records
* Junk records
  * non-book items
  * other non-record items the are generated due to errors
* Corrupt data
  * Unicode conversion
  * Dates, names, ISBN10 -> 13 conversion etc.
  * Misaligned metadata (good values in incorrect fields, multiple values in one field etc.)
  * Mismatched identifiers contribute to conflation issues

## Current state

## Other issues related to importing