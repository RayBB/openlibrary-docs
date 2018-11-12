## 5 Million Orphans
"Orphaned Editions" are Open Library book records that only have an edition item (OL..M) and no corresponding work (OL..W). Search results list works, and the main landing page for a book is a work page. One work can have many editions. Editions without works break the data model and cause various problems with search, links, and syncing data. There is a hack to make search mostly work with these orphans where the edition is indexed as if it is a work. No current process is creating new orphans, but there exist 5 million from the early days of Open Library. An ongoing task has been to find a way to reduce and fix these completely.

## 2018 Update

The information in the sections below is still accurate, but has been difficult to act upon at scale.

Recently the Import process has been updated to allow reliable re-imports of existing books from individual, or bulk, MARC record sources. Part of this revised process adds works to matched editions if they don't already exist. This means orphaned editions can be fixed by reimporting from their MARC source, or matching archive.org items by using an [import endpoint](https://github.com/internetarchive/openlibrary/wiki/Endpoints#importing).

This is a huge win, and will allow the editions-without-works problem to be solved finally, once we re-process all the data.

### New process drawing on the plans below
For each category identified below, in priority order, filter the orphan edition records from the OL db dumps, determine the original source from `source_records` and perform the appropriate [re-import request](https://github.com/internetarchive/openlibrary/wiki/Endpoints#importing).

![orphaned editions graph](https://cdn.pbrd.co/images/HMSSMUg.png)

## Planning

Query to extract all orphans from OL edition dump (25M records). [**DONE!**]
Extract 5M orphans.

### Gather statistics, divide into groups.

### Focus on orphans with OCAIDs because:

these are the records that are borrowable / readable and their discoverability is adversely affected by not being associated to works. Has implications for search engine indexing, and the v2 availability API.

**First priority:** Duplicate OCAID orphans. These have two issues -- not associated with any work, and are duplicate records which should be merged down. These can be matched with existing records that have works and turned into redirects, or grouped together and have a single work created for the best record. **COMPLETED**


**Second stage** Merge down remaining duplicate OCAID works. There are as of August 2017 60,786 identified groups of duplicate works, so at least twice that many records. These groupings need further checking to determine the safest way to merge the records down. 

| Groupings  | Number of OCAIDs     | Total number of works/editions |
| ---------- | -------------------: | -----------------------------: |
| Doubled    |    47,467            |   94,934  |
| Tripled    |     4,761            |   14,283  |
| Quadrupled |       666            |    2,664  | 
| 5+ dupes   |        58     |_(at least)_ 290  |
|  **TOTAL** |    52,952            |  112,171  |

**Third stage** Clean out any bad records, spam / bad data / non-book items in the list of orphans to reduce identification and merge workload.

**Fourth stage** The 59% of 192K orphaned OCAIDs with unknown authors need to be checked to see if author information is available from the original records and author / editor data added where possible. Then existing ids can be used to find matches using the methods outlined below. Once all ids and author/title matching attempts are completed, any remaining editions can have works created. 


In the April 2017 data dump there were 4067 duplicate OCAID orphans. In the August 2017 dump there were 7 after the processing and merging by the CleanupBot. These 7 have since been manually merged, so there are no more editions in this class.

Regenerate statistics for the classes shown in my original graphs for the April data dump. Highlight improvements.

From the April 2017 graph:

|			|April	|August	|Improvement|
|-----------------------|------:|------:|---:|
|duplicate OCAIDs	|130K	|128K	| 2K |
|orphaned dupe OCAIDs	|4067	|0	| 4K |
|other orphaned OCAIDs	|219K	|192K	|27K |

**Output** Method to automatically generate the data splits and statistics from any edition dump.

### Percentage of orphans with Author information (August 2017 dump)

| Group  | Authors    |
|------- | ---------- |
|All 25M Editions              | 20M editions have author information. |
|All 5M Orphans                | 1.2M orphans have authors. |
|Orphans with OCAIDs (192,800) | 79K orphans with OCAIDs have authors. |

### What were the sources of orphan records?

**Theory:** these were the early imports and user edits before OL automatically created works. Suspect creation dates to be clustered around 2009. Need to confirm this by collected created_date statistics.

Sources: from Amazon records?, from IA MARC records?
  * Count and graph sources
  * Count and graph created_dates

... insert created dates graph ...

### Operations to resolve orphans
  * Delete, if the record is purely bad data
  * Redirect, if the edition is an exact duplicate of another edition correctly associated with a work (this happens frequently -- there were often double imports in the early days of OL)
  * Associate with existing work
  * Create new work and associate, if there are really no existing works or editions

The Duplicate OCAID orphans had some records that required two orphans to be merged ((2) Redirect above), and then a new work had to be created ((4) Create new work) to resolve the issues. Now that those records have been cleared, only one of the above solutions should be sufficient to resolve any remaining orphaned edition.

### Basic process

For each valid orphan we want to determine whether we need to create a new work, or associate it with an existing one.

### Merge Technique

Use unique ids on orphaned editions to find a matching edition already associated with a work, 
  * if a clear duplicate, convert orphan to a redirect.
  * if not a clear duplicate, associate orphan with the work.

This works well if the original data is good. If the data is bad, incorrect associations can be made. Some bad ids can allow many unrelated editions to become collected under the wrong work. The mitigating factor to this is that the data was already incorrect in the database and needed to be fixed, at least this process groups like with like so the data problem should be more visible and can be eventually fixed in one step.

Ids to use: 
  * OCAID
  * ISBN (with xisbn lookups as an extension)
  * other ids

#### Another approach
 For orphans with author information, look for near title matches also by that author to determine an existing work. 

#### Further reduction techniques:
  Identify any orphans that are simply bad data and candidates for deletion.
To explore.
  * Non-book items
  * Blank title, low character title counts
  * Garbage strings / spam
  * not enough data to be worthwile. What is the threshold?

### Synchronising with the IA v2 Availability API
For every previously orphaned OCAID edition that is associated with a work, pass its id to the admin IA sync endpoint.