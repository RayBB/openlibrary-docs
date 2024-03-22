# Quickstart

For a top-level executive summary of the Open Library project, please see the [Main Open Library Index](https://docs.google.com/document/d/1KJr3A81Gew7nfuyo9PnCLCjNBDs5c7iR4loOGm1Pafs/edit#heading=h.2pqg6f58xqb3). This document contains a year-by-year breakdown of board reports, roadmaps, community call documents, a project index, and top-level team documents spanning engineering, design, communications, and more.

# Meet the Team

As of 2024, the Open Library program is directed by Mek Karpeles and staffed by Drini Cami, Jim Champ, and Scott Barnes, with significant support from Lisa Seaberg from Patron Services. The project enjoys contributions from volunteers spanning more than 20 nations.

# Table of Contents

1. [About Open Library](#About_Open_Library)
2. [Contributing](https://github.com/internetarchive/openlibrary/blob/master/CONTRIBUTING.md)
3. [Project Management](https://github.com/internetarchive/openlibrary/wiki/HOWTO:-Open-Library-Project-Management)
4. Codebase & Architecture
  * [Infogami](https://openlibrary.org/dev/docs/infogami)
  * [Data Model](https://github.com/internetarchive/openlibrary/wiki/Understanding-The-Data-Model)
  * [Search Engine](https://github.com/internetarchive/openlibrary/wiki/Solr)
  * [Front-end](https://github.com/internetarchive/openlibrary/wiki/Frontend-Guide)
  * [Imports](https://docs.google.com/document/d/1KRtKYFEp40rgWlxWR1G3v60YSKIQBXbKQTjTloD0Vbg/edit)
5. Teams
  * [Design](https://docs.google.com/document/d/1KLy6XRvwHaXrvHlZ-Ol_kFoIdn9eRMGuWeSYvWox1Qw/edit)
  * [Librarianship](https://openlibrary.org/librarians)
  * [Communications](https://docs.google.com/document/d/14FS1A0fbgwRWHTl7_AbVixZiUVc2ctN1wUgW6Mwt5jw/edit)
6. [Internationalization](https://github.com/internetarchive/openlibrary/wiki/Internationalization-Contributor's-Guide-(i18n)) and [Accessibility]()
6. [Responsibilities Matrix](https://docs.google.com/document/d/1frjwLxsa3J_ZyU8p0glUwLI_K8OL6yF9xRkyylbwktw/edit#heading=h.ff2pas7bc7ye)
  * [Deployments](https://github.com/internetarchive/openlibrary/wiki/Deployment-Guide)

# About Open Library

You can read more about the vision and mission of the Open Library [here](https://openlibrary.org/about). In 2005, the Internet Archive co-founded the [Open Content Alliance (OCA)](http://web.archive.org/web/20191230215831/https://en.wikipedia.org/wiki/Open_Content_Alliance) to digitize and archive the world’s books. Open Library was born shortly after, circa 2006, as a card catalog for every published book. Since its inception, OpenLibrary.org has aspired to enable patrons to access [readable digital editions](https://web.archive.org/web/20080121231120/http://demo.openlibrary.org/b/Heartbreaking_of_Genius_0) (where available) of open access, public domain, and unrestricted books. In 2007 the Internet Archive received [Special Library](https://web.archive.org/web/20150914165436/http://blog.librarylaw.com/librarylaw/2007/07/internet-archiv.html?cid=77778944#comment-6a00d8341c69e553ef00e3981f224f8833) (Rush Brandis, California State Library) [classification](http://old.post-gazette.com/pg/07175/796164-96.stm) by the State of California. This same year, Aaron Swartz gave a seminal [talk](https://www.youtube.com/watch?v=zQuIjwcEPv8) about Open Library and its roadmap at Harvard University's Berkman Klein Center. In 2011, the Internet Archive piloted an online [lending program](https://blog.archive.org/2011/02/22/in-library-ebook-lending-program-launched/) on OpenLibrary.org, in collaboration with several [OCA partners](http://web.archive.org/web/20110430161803/http://openlibrary.org/libraries). In 2014, the Internet Archive received a [grant](https://web.archive.org/web/20190426090129/https://library.ca.gov/Content/pdf/grantpdf/narrative-report/40-8343_NAR2.pdf) under the Library Services and Technology Act (LSTA) from the California State Library system to support the digitization of books and the development of OpenLibrary.org as an online lending library service. After the completion of the grant and the [passing](https://blog.openlibrary.org/2013/01/12/rest-in-peace-aaron-swartz/) of its co-founder [Aaron Swartz](http://aaronsw.com), Open Library entered a period of hiatus, without full-time staff, and was considered for [sunset](https://en.wikipedia.org/wiki/Sunset_(computing)). The project was kept on life support in 2015 through the shared efforts of Jessamyn West, Giovanni Damiola, and Brenton Cheng until 2016 when the program transferred leadership to Mek and a [community](https://github.com/internetarchive/openlibrary/graphs/contributors) of volunteers. The project welcomed key improvements, like the “[Want to Read](https://blog.openlibrary.org/2017/12/27/a-holiday-gift-from-open-library-introducing-the-reading-log/)” button and a mobile redesign. In 2019, Open Library [launched](https://boingboing.net/2019/10/22/hathi-never-forgets.html) the [Book Sponsorship program](https://web.archive.org/web/20191104221524/https://openlibrary.org/sponsorship), enabling the community to help fund the digitization of books missing from the lending program. In 2020, Open Library invested in sustainability (upgrading to [Python3](https://github.com/internetarchive/openlibrary/issues/3333), establishing an [import pipeline](https://github.com/internetarchive/openlibrary-bots/tree/master/BWBImportBot), and production Docker), simplifying the [patron experience](https://github.com/internetarchive/openlibrary/issues/684), and improving [discovery](https://twitter.com/borrowbot) & adoption by booklovers. In 2021, we focused on imports, partnerships, search, and becoming the Open Book Catalog for the Internet. In 2022, we focused on increasing direct value to patrons by improving the core usability and experience of the service: book page design, edition-level search, navigation, mobile, and performance. In 2023, having plucked low hanging fruit and achieved feature parity with many different services, it became essential for Open Library to clarify its unique value proposition and did so by conducting design research with its patrons. In 2024, the project is acting on these learnings to focus and align efforts to achieve a more defensible and bright library future.

## Frequently Asked Questions

Don't see what you're looking for? Check [questions asked by contributors on Github](https://github.com/internetarchive/openlibrary/issues?q=is%3Aissue+cache+label%3A%22Type%3A+Question%22+) or [submit your own question](https://github.com/internetarchive/openlibrary/issues/new?assignees=&labels=Type%3A+Question%2C+Needs%3A+Triage%2C+Needs%3A+Lead%2C+Needs%3A+Community+Discussion&projects=&template=question_template.md&title=)

- [How do I set up the Open Library app locally?](https://github.com/internetarchive/openlibrary/tree/master/docker#welcome-to-the-docker-installation-guide-for-open-library-developers)
  - What process should I follow if I encounter a problem when building with docker?
- How do I find, claim, and work on a [good first issue](https://github.com/internetarchive/openlibrary/issues?q=is%3Aopen+is%3Aissue+label%3A%22Good+First+Issue%22+)?
  - [What git conventions does the project follow?](https://github.com/internetarchive/openlibrary/wiki/Git-Cheat-Sheet)
  - [How do I submit a good pull request?](https://github.com/internetarchive/openlibrary/wiki/Git-Cheat-Sheet#creating-a-pull-request)
- [How can I debug when things go wrong?](https://github.com/internetarchive/openlibrary/wiki/Debugging-and-Performance-Profiling)
- [How do I import production book & author data into my local environment?](https://github.com/internetarchive/openlibrary/wiki/Loading-Production-Book-Data)
- [How can I login as a user in my local environment?](https://github.com/internetarchive/openlibrary/blob/master/CONTRIBUTING.md#logging-in-as-admin)
- [How do I add a new route to Open Library? (tutorial)](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/README.md#tutorial-implementing-a-new-route)
- [How do I add new Javascript functionality to a template?](https://github.com/internetarchive/openlibrary/wiki/Frontend-Guide#adding-new-javascript-files-to-html-templates)
- How do I find the right [CSS file](https://github.com/internetarchive/openlibrary/wiki/Frontend-Guide#working-with-css) to add style rules?
- [How do I rebuild css & js assets after I make changes?](https://github.com/internetarchive/openlibrary/wiki/Frontend-Guide#building-css-and-js)


# Open Library Community Calls

Welcome to the Open Library Community Call! We're thrilled to have you join our community. Whether you're a long-time member or brand new, we encourage everyone to participate in these calls to discuss the evolution of OpenLibrary.org.

If you haven't already **please fill out the appropriate form on the [Volunteers Page](https://openlibrary.org/volunteer).**

## Important Links

- [Zoom Meeting](https://zoom.us/j/369477551) for Community Call
- [2024 Community Calls Meeting Notes](https://docs.google.com/document/d/11jMuWxaGClzK29VCK-ZhxFfk2737c3VynI-LJiraCJo/edit)

## Agenda

Our calls typically follow this agenda:

1. Welcome
    - Intros for new people
    - Shoutouts and wins in the community
2.  Review unresolved action items
3.  Weekly Updates
    - Share what you did last week
    - What you plan to do this week (or ask for ideas)
    - Blockers (such as waiting for code review)
    - Leads can make sure a feature is one that the community agrees on
4.  Open Mic: A time for any additional topics, questions, or discussions like:
    - Does it make sense to use this beta library?
    - Where in the codebase does this happen?
    - Feedback on new team page

If there's a longer topic you'd like to discuss during the Community Call, please add it to the Agenda under "Open-Mic Topics."

## Types of Calls

| Type of Call        | Schedule                                                                             | Description                                         |
| ------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------- |
| Community Call      | Every Tuesday at [9 AM Pacific](https://time.is/compare/0900_in_San_Francisco)       | All community members are welcome to participate.   |
| Design Call         | Every Friday at [9 AM Pacific](https://time.is/compare/0900_in_San_Francisco)        | For those interested in design-related discussions. |
| Communications Call | Monthly, Thursdays at [10 AM Pacific](https://time.is/compare/1000_in_San_Francisco) | Geared towards the communications team.             |

Note: Design and Communications calls usually have different Zoom links.

## Roles and Responsibilities
A member of the community will take on each of these roles, which are rotated regularly.

- Document Secretary: Responsible for updating the weekly chart, copying the minutes template, and sending reminders about the Community Call.
- Facilitator: Guides the flow of the call.
- Notetaker: Records the meeting minutes.

## Community Call Norms

We want everyone to feel comfortable and included during our Community Calls. Here are a few norms we follow to make that happen:

- You don't have to have your camera on, but we'd love to see your smiling face if you're comfortable with it!
- Please keep yourself muted when you're not talking to minimize background noise.
- You may speak up during the meeting. We also encourage the use of [raised hands](https://support.zoom.us/hc/en-us/articles/205566129-Raising-your-hand-in-webinars-and-meetings) and [emoji reactions](https://support.zoom.us/hc/en-us/articles/115001286183-Using-non-verbal-feedback-and-meeting-reactions-). However, be mindful that if someone is sharing their screen they may not be able to see it.

We hope these norms help create a welcoming and productive environment for everyone. Thank you for being a part of our community!

## Recording Policy

We generally do not record our Community Calls. However, if we want to record something like a demo, we will give you a heads up beforehand.

## Accessibility

We use Zoom's automated captions (live transcription) for our community calls. You can read more about it in [Zoom's documentation](https://support.zoom.us/hc/en-us/articles/4403492514829-Viewing-captions-in-a-meeting-or-webinar). If you have any trouble with it, please let us know.

## FAQs

### What if I can't attend a call?
Post in Slack or leave a note in the document ahead of time including what you'd like discussed or need help with.

### How often does the meeting notes link change?
Yearly, around December.

### Where are the links for the design and communications calls?

The design call notes are in the same document as the community call, to keep things in one place and searchable.


## Get Involved!

We're thrilled to have you as part of our Open Library community. Please feel free to join any of our calls, share your insights, and contribute to the growth of OpenLibrary.org. Your input is invaluable to us, and we look forward to your participation.

If you're new to our community, don't forget to fill out the [volunteer form](https://openlibrary.org/volunteer) before joining the Zoom call. It helps us get to know you better!

## Additional Links

- [Open Library Index of Important Document](https://docs.google.com/document/d/1KJr3A81Gew7nfuyo9PnCLCjNBDs5c7iR4loOGm1Pafs/edit)
- [All Past Open Library Community Call Notes Minutes](https://github.com/internetarchive/openlibrary/wiki/Open-Library-Community-Call-Minutes)
