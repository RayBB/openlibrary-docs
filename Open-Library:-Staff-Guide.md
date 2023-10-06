Open Library is run by a very small team of staff and lots of volunteers. Here is an owner's manual to help those maintaining the project.

Your main entry point into the project is the [Main Program Index](https://docs.google.com/document/d/1KJr3A81Gew7nfuyo9PnCLCjNBDs5c7iR4loOGm1Pafs/edit#heading=h.2pqg6f58xqb3). This links to most our most important documents over time. [Here is an executive summary](https://docs.google.com/document/d/1frjwLxsa3J_ZyU8p0glUwLI_K8OL6yF9xRkyylbwktw/edit#heading=h.ff2pas7bc7ye) of what I do to run Open Library and how we [manage the project](https://github.com/internetarchive/openlibrary/wiki/HOWTO:-Open-Library-Project-Management).

## Main Activities

| Guide | Description |
|-------|-------------|
| [Deploys](https://github.com/internetarchive/openlibrary/wiki/Deployment-Guide) | Deploying code to the website |
| [Postmortems](https://github.com/internetarchive/openlibrary/issues?q=is%3Aissue+label%3A%22Type%3A+Post-Mortem%22) | When we encounter an operational problem we open a new post-mortem issue and follow the template. This results in a searchable archive of problems, troubleshooting guide, and fixes for the future. |
| [Provisioning](https://github.com/internetarchive/openlibrary/wiki/Production-Service-Architecture) | Occasionally, a server will need to be rebuilt or upgraded. This guide explains how to approach this process and offers notes on the state of our different services. |
| [Project Management](https://github.com/internetarchive/openlibrary/wiki/HOWTO:-Open-Library-Project-Management) | Describes our various meetings, when and how we do planning, and how we use tools/platforms like github. | 
| [Search Engine Re-indexing](https://github.com/internetarchive/openlibrary/wiki/Solr) | We presently manually kick off ~monthly solr re-indexes and alternate between two blue-green servers to ensure uptime as we rebuild. @cdrini is the domain expert. I believe we may still benefit from a [tutorial doc, see #8390](https://github.com/internetarchive/openlibrary/issues/8390) |

## Services

Open Library depends on lots of services and tasks that run regularly and may require staff intervention.

* [Cover archival](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/coverstore/README.md)
* ImportBot and [Archive.org ↔ OpenLibrary.org Sync](https://github.com/internetarchive/openlibrary/wiki/archive.org-%E2%86%94-Open-Library-synchronisation)
* Monthly [Data Dump](https://github.com/internetarchive/openlibrary/wiki/Generating-Data-Dumps) & [Sitemap](https://github.com/internetarchive/openlibrary/wiki/Sitemap-Generation) Generation -- see also [Cron Jobs Guide](Cron-Jobs) 

## Team Structure & Communication

Most communication occurs on slack. The Open Library team is a branch of the **Product/UX Team**. The greater Product Team tends to meet for standup on Mondays and Wednesdays to check-in and give updates and discussion occurs in the #ux-team slack channel. The Open Library team sometimes internally refers to itself as ABC, or the "Archive Book Catalog" Team, which is a serendipitous homage to the Abaissé Café ("of the people", from Les Mis).

As explained in our [Project Management](https://github.com/internetarchive/openlibrary/wiki/HOWTO:-Open-Library-Project-Management) guide, Open Library **staff** meets at the beginning of the week to get in sync. We have a [template](https://docs.google.com/document/d/1sjcXxqLvchsf7v1B190q1YoJx3fDuikemUBp_aHG7Ls/edit) for how to run our meeting and the call leader tends to rotate. A new document is created for each year and the old one is added to the [Main Program Index](https://docs.google.com/document/d/1KJr3A81Gew7nfuyo9PnCLCjNBDs5c7iR4loOGm1Pafs/edit#heading=h.2pqg6f58xqb3).  

On Tuesdays we have a public [Open Library community call](https://docs.google.com/document/d/1joLJzuY3YM1g6nZZSaqqM35DC_CVLbiOG9vhj21UKmw/edit). It follows similar principles to the ABC staff call, the call similarly rotates call leaders and notetakers, and the notes document similarly gets rotated yearly.

On Fridays, there is an Open Library design call which takes place in the [same document](https://docs.google.com/document/d/1joLJzuY3YM1g6nZZSaqqM35DC_CVLbiOG9vhj21UKmw/edit) as the community call, in the interest of keeping things in one place and searchable. In the future, it could be good if design had its own document

## Guides for other Team Leads & Volunteers

This section needs to be [DRY'ed](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) up because there's our...
1. [Public Team Page](https://openlibrary.org/about/team)
2. [Lead Labels on Github](https://github.com/internetarchive/openlibrary/labels?q=Lead%3A) 
3. Outdated [Web of Commitments](https://docs.google.com/spreadsheets/d/1naTQgj_oLrJBUiqQNpa738Z2bQ4IqCCKs7KU1j8Pq4U/edit#gid=0)

| Role | Lead |
|------|------|
| [Program Lead](https://docs.google.com/document/d/1frjwLxsa3J_ZyU8p0glUwLI_K8OL6yF9xRkyylbwktw/edit) | @mekarpeles |
| [Lead Community Librarian](https://github.com/internetarchive/openlibrary/wiki/Lead:-Community-Librarian) | @seabelis |
| [Communications Lead] | Nick Norman | 