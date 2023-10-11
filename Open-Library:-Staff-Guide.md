Open Library is run by a very small team of staff and lots of volunteers. Here is an owner's manual to help those maintaining the project.

Your main entry point into the project is the [Main Program Index](https://docs.google.com/document/d/1KJr3A81Gew7nfuyo9PnCLCjNBDs5c7iR4loOGm1Pafs/edit#heading=h.2pqg6f58xqb3). This links to most our most important documents over time. [Here is an executive summary](https://docs.google.com/document/d/1frjwLxsa3J_ZyU8p0glUwLI_K8OL6yF9xRkyylbwktw/edit#heading=h.ff2pas7bc7ye) of what I do to run Open Library and how we [manage the project](https://github.com/internetarchive/openlibrary/wiki/HOWTO:-Open-Library-Project-Management).

## Main Activities

| Guide | Description |
|-------|-------------|
| [Deploys](https://github.com/internetarchive/openlibrary/wiki/Deployment-Guide) | Deploying code to the production website and testing environments |
| [Emergency Response](https://github.com/internetarchive/openlibrary/wiki/Disaster-Recovery-&-Immediate-Response), & [Postmortems](https://github.com/internetarchive/openlibrary/issues?q=is%3Aissue+label%3A%22Type%3A+Post-Mortem%22) | When we encounter an operational problem, our first step is to open a new post-mortem issue and follow the template as a way to take notes and document our process. This helps us systematize diagnostics to arrive at resolution quickly and also results in a searchable archive of problems, troubleshooting guide, and fixes for the future. See also our legacy [disaster History Log](Disaster-History-Log). |
| [Spam](https://github.com/internetarchive/openlibrary/wiki/Anti-Spam-Tools) | Strategies for dealing with spam within a system that anonymizes patron IPs by default. |
| [Provisioning](https://github.com/internetarchive/openlibrary/wiki/Production-Service-Architecture) | Occasionally, a server will need to be rebuilt or upgraded. This guide explains how to approach the provisioning process and offers notes on the state of our different services. |
| [Search Engine Re-indexing](https://github.com/internetarchive/openlibrary/wiki/Solr) | We presently manually kick off ~monthly solr re-indexes and alternate between two blue-green servers to ensure uptime as we rebuild. @cdrini is the domain expert. I believe we may still benefit from a [tutorial doc, see #8390](https://github.com/internetarchive/openlibrary/issues/8390) |
| [Cover Archival](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/coverstore/README.md) | This process is not yet hands-free. There is a [recipe](https://github.com/internetarchive/openlibrary/issues/8278#issue-1888611543) for how we can run this in the meantime. |
| [Coordinating Volunteers](https://docs.google.com/forms/u/1/d/1wyyE3eVpMIN6QG2CMMAbmoeGcHKB8Q7HmZKFb9sg5Ow/edit) | We have a [volunteer form](https://openlibrary.org/volunteer) where contributors submit requests to collaborate. |

## Project Management

| Guide | Description |
|-------|-------------|
| [Project Management](https://github.com/internetarchive/openlibrary/wiki/HOWTO:-Open-Library-Project-Management) | Describes our various meetings, when and how we do yearly roadmapping and monthly milestone planning, and how we use tools/platforms like github. | 
| [GitHub Issues](https://github.com/internetarchive/openlibrary/wiki/Interacting-with-GitHub-Issues) & [Managed Labels](https://github.com/internetarchive/openlibrary/wiki/Using-Managed-Labels-to-Track-Issues) | How staff manages issues and labels on Open Library | 
| [Code Reviewer Guidelines](https://github.com/internetarchive/openlibrary/wiki/Code-Reviewer-Guidelines) | Code Review Guidelines | 


## Error Reporting & Analytics

See our [Monitoring Bible](https://github.com/internetarchive/openlibrary/wiki/Monitoring) for a complete list of useful services

| Service | Description |
|-------|-------------|
| [Sentry](https://sentry.archive.org/organizations/ia-ux/issues/46145/?project=7&query=lending&referrer=issue-stream&statsPeriod=14d) | We use sentry to investigate errors & performance  |
| [Grafana](https://grafana.us.archive.org/d/000000176/open-library-dev) | We use grafana to see real-time analytics about site performance and service health |
| [Nagios](https://monitor.archive.org/cgi-bin/nagios3/status.cgi?hostgroup=24.openlibrary&style=detail) | We use Nagios to set alerts and monitor when services hit critical errors or thresholds which may require intervention |
| [Plausible](https://plausible.prod.archive.org/openlibrary.org) | Our alternative for google analytics |

## Services

Open Library depends on lots of services and tasks that run regularly and may require staff intervention.

* Monthly [Data Dumps](https://github.com/internetarchive/openlibrary/wiki/Generating-Data-Dumps) & [Sitemap](https://github.com/internetarchive/openlibrary/wiki/Sitemap-Generation) Generation and [ImportBot](https://github.com/internetarchive/openlibrary/wiki/Developer's-Guide-to-Data-Importing#production-automatic-import-pipeline) and [Archive.org ↔ OpenLibrary.org Sync](https://github.com/internetarchive/openlibrary/wiki/archive.org-%E2%86%94-Open-Library-synchronisation) should run automatically each month or as a daemon, as outlined in our [Cron Jobs Guide](Cron-Jobs) 
* The [BookWorm / Affiliate Server](https://github.com/internetarchive/openlibrary/blob/master/scripts/affiliate_server.py) fetches book data on the fly from vendors and imports some missing data for books on-the-fly. It has [several issues](https://github.com/internetarchive/openlibrary/issues?q=is%3Aissue+is%3Aopen+label%3A%22Theme%3A+Affiliate+API%22) which need to be addressed 

## Team Structure & Communication

Most communication occurs on slack. The Open Library team is a branch of the **Product/UX Team**. The greater Product Team tends to meet for standup on Mondays and Wednesdays to check-in and give updates and discussion occurs in the #ux-team slack channel. The Open Library team sometimes internally refers to itself as ABC, or the "Archive Book Catalog" Team, which is a serendipitous homage to the Abaissé Café ("of the people", from Les Mis).

As explained in our [Project Management](https://github.com/internetarchive/openlibrary/wiki/HOWTO:-Open-Library-Project-Management) guide, Open Library **staff** meets at the beginning of the week to get in sync. We have a [template](https://docs.google.com/document/d/1sjcXxqLvchsf7v1B190q1YoJx3fDuikemUBp_aHG7Ls/edit) for how to run our meeting and the call leader tends to rotate. A new document is created for each year and the old one is added to the [Main Program Index](https://docs.google.com/document/d/1KJr3A81Gew7nfuyo9PnCLCjNBDs5c7iR4loOGm1Pafs/edit#heading=h.2pqg6f58xqb3).  

On Tuesdays we have a public Open Library [community call](https://github.com/internetarchive/openlibrary/wiki/Community-Call). It follows similar principles to the ABC staff call, the call similarly rotates call leaders and notetakers, and the notes document similarly gets rotated yearly.

On Fridays, there is an Open Library design call which takes place in the [same document](https://docs.google.com/document/d/1joLJzuY3YM1g6nZZSaqqM35DC_CVLbiOG9vhj21UKmw/edit) as the community call, in the interest of keeping things in one place and searchable. In the future, it could be good if design had its own document

## Guides for other Team Leads & Volunteers

| Role | Lead |
|------|------|
| [Program Lead](https://docs.google.com/document/d/1frjwLxsa3J_ZyU8p0glUwLI_K8OL6yF9xRkyylbwktw/edit) | @mekarpeles |
| [Lead Community Librarian](https://github.com/internetarchive/openlibrary/wiki/Lead:-Community-Librarian) | @seabelis |
| [Communications Lead](https://docs.google.com/document/d/14FS1A0fbgwRWHTl7_AbVixZiUVc2ctN1wUgW6Mwt5jw/edit#heading=h.mlb9ylj7whus) | Nick Norman | 
| [Design Lead](https://docs.google.com/document/d/1KLy6XRvwHaXrvHlZ-Ol_kFoIdn9eRMGuWeSYvWox1Qw/edit#heading=h.b20z3avugr8c) | Staff |

This section needs to be [DRY'ed](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) up because there's our...
1. [Public Team Page](https://openlibrary.org/about/team)
2. [Lead Labels on Github](https://github.com/internetarchive/openlibrary/labels?q=Lead%3A) 
3. Outdated [Web of Commitments](https://docs.google.com/spreadsheets/d/1naTQgj_oLrJBUiqQNpa738Z2bQ4IqCCKs7KU1j8Pq4U/edit#gid=0)

