**Update** Open Library will be participating in Google Summer of Code 2019! 

***

[Apply to Google Summer of Code](https://summerofcode.withgoogle.com/organizations/6482109326163968/)

***

# 2019 GSoC

More details to be announced. See: [Internet Archive 2019 GSoC Application](https://docs.google.com/document/d/1posF4zhq2lAz7eikloT9_K4LnHXfJ5VWGpCtJS6rJ0M/edit)

Open Library (https://openlibrary.org) is a digital library run by Internet Archive which loans over a 1.5M ebooks each year to over 2M patrons around the world. We’re looking for an engineer to lead us in democratizing book acquisition by giving readers the ability to crowd-fund and sponsor the books they want in their Open Library.

There are 26M books listed in Open Library’s catalog, but only 3M of these web-pages link to readable / borrowable copies of the digital book. The remaining 23M book pages offer useful information, but the books themselves need to be purchased for the library in order to be unlocked to our readers. As an engineer on the project, you will be designing a pilot program which adds actionable “sponsor” buttons to these 23M book pages and allows patrons to fund and sponsor the books they want. Instead of books sitting unused on our bookshelves, let’s instead make the books we love available to the world! [Learn more](http://blog.openlibrary.org/2018/10/27/raising-crypto-for-the-greater-good)

You are encouraged to look through our [github issues](github.com/internetarchive/openlibrary/issues) and [2018 roadmap](https://github.com/internetarchive/openlibrary/projects/7#column-2354676) for ideas.

Feel free to [open new github issues](https://github.com/internetarchive/openlibrary/issues/new) which you can then include in your proposal!

Requires: Python + PHP, JavaScript, CSS/less, Docker, Postgres

# 2018 GSoC
Open Library (https://openlibrary.org) is a digital library which lends over a million ebooks each year to its 1.75M patrons. The Internet Archive is looking for someone self-directed who loves books and technology to help Open Library expand to a global audience, improve search and discovery, and empower communities with tools to fund the books they want available in their digital library.

The ideal GSoC “Open Librarian” would design and submit a coherent proposal with a plan to improve specific metric(s) like:
- **Number of borrows:** What percentage of our books are being checked out and used? What ideas do you have to improve discovery of books? How can we encourage users to return books they’re not reading so they become available to others?
- **Engagement (# new members, uniques, time on site):** What changes might we make to promote valuable engagement on Open Library? How can we do better at serving an international audience (e.g. i18n)? Are we missing features (e.g. star ratings) which other websites have proven effective that our members also want? Would more people use the site if it were mobile responsive?
- **Catalog Coverage:** How can we increase the number of books which are listed in Open Library’s book catalog? How many modern book records are missing from our catalog? What sources / feeds (e.g. ONIX feeds, MARC records, APIs) are available to help keep our catalog of books up to date? How can our website be improved to help the community maintain our catalog? How might our users be able to contribute books into Open Library?
- **Site Reliability:** How can Open Library move from vagrant to a docker-based production build system with ansible and kubernetes? How can we detect and prevent abuse? How can we increase our test coverage?

You are encouraged to look through our [github issues](github.com/internetarchive/openlibrary/issues) and [2018 roadmap](https://github.com/internetarchive/openlibrary/projects/7#column-2354676) for ideas.

Feel free to [open new github issues](https://github.com/internetarchive/openlibrary/issues/new) which you can then include in your proposal!

**Requires:** Python, JavaScript, git

**Bonus:** solr, Docker, postgres

# General Advice

1. Your application shouldn't just be a collection of issues. Group issues into logical themes. For instance, "my theme for phase one of my roadmap is making Open Library more accessible to people in non-US countries".
2. Ask lots of questions -- some of your ideas may be easy in principle, but hard because Open Library's code base can be difficult to work with, an issue may take longer than expected! Ask mentors how long they think an issue will take, it's one of the most important pieces of value they can offer.
3. Consider creating Open Library issues proposing features you'd like to include in your application. Get feedback from the community and see whether it's something they also value and will support.
4. Have an idea of what success means / looks like from the very beginning. How will you know if you've won? Brewster suggests one strategy is, "start with the aspirational blog post and work backwards".

# Need Inspiration?

Depending on what you specifically valuable about Open Library, here is an example of what an application may say:

> The reason I am drawn to Open Library is I feel every country should have a library system. Right now, X countries don't have public library systems. As a result, I am designing a plan to increase the number of international users who visit Open Library and borrow books. First we'll add an option to account creation which allows users to select their country and language (see issue #XXX on github)...

## What Does a Good Synopsis Look Like?
A good summary addresses the following 6 questions (replace `Open Library` with whatever project you're applying for): 

1) What is Open Library
> Open Library is a non-profit website run by Internet Archive. It tries to catalog every book in the world and has web pages for over 27 million book editions. 4M of the books in their catalog are made accessible online by Internet Archive for reading and controlled digital lending.
2) Why is Open Library important
> Not every library is equal. Some cities don’t have libraries at all. Open Library is an opportunity to provide equal opportunity to readers all over the globe.
3) What Opportunity exists for Open Library
> Today, Open Library is limited to the books Internet Archive decides should be acquired and made available through their library program. But there’s an opportunity to democratize Open Library’s bookshelves and extend this power to patrons so every reader in the world may be empowered to Sponsor books of their choosing.
4) Why now? Why is this opportunity possible now (and wasn’t possible before?)
> Last year, Open Library added a Want to Read button to their website enabling patrons to tell us which books we are missing from the library. To our surprise, over 400k unique patrons clicked this button since we added it, teaching us that patrons are eager to tell us which books they want. I believe some percentage of these patrons may also be willing to make a monetary donation to sponsor the accessioning of these desirable books.
5) What does the solution look like?
> For GSoC 2019, we’d like to test this hypothesis by adding a `Sponsor this Book` button that will show up on the 23M remaining books which Open Library knows about but have not yet been obtained.
6) What does success for Open Library look like? What is the potential impact, who will benefit?
> For Open Library, success means establishing an new distribution channel to receive donations, promoting long term sustainability. We also hope to improve and democratize our holdings by empowering thousands of patrons to participate in book sponsorship.

## Examples

You can view a sample proposal template [here](https://docs.google.com/document/d/1IGTAMczT9A1EwyV_E73f2bHWscv85gyYAc7PLXJfPLs/edit?usp=sharing).
