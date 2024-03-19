[**Apply to Google Summer of Code**](https://summerofcode.withgoogle.com/organizations/5089442861154304/)

[**See Open Library's GSoC 2024 Proposal**](https://docs.google.com/document/d/1Wh3tAxS4T9eKLa5x8iILft964v8zriaq-hKcu300Lg4/edit#heading=h.mn497pr3rien)
 
***

# Welcome

Google Summer of Code (GSoC) is a global program (paid mentorship program) focused on bringing more developers into open source software development. Contributors with an open source organization on a 3 month programming project during their break from school. You can read more [on Google's GSoC website](https://summerofcode.withgoogle.com). The program is run by Google, which selects aligns organizations to mentor contributors on projects.

Candidates [see eligibility requirements](https://buildyourfuture.withgoogle.com/programs/summer-of-code) apply by submitting an application to one or more participating/mentoring organization. Open Library GSoC projects may span everything from writing bots to imports or organize books, to new crowd-source programs which allow patrons to fund and sponsor books they love for the library.

## History

Internet Archive has participated in Google Summer of Code for 3+ years. Open Library has participated twice (2018, 2020). In 2019, the Internet Archive did not receive enough slots for Open Library to participate and so we designed and ran our own Internet Archive Summer of Code (IASoC) internship. 

- [Google Summer of Code 2019](Google-Summer-of-Code-2019)
- [Google Summer of Code 2018](Google-Summer-of-Code-2018)

## Your chances

Typically, hundreds of candidates email us to inquire about GSoC. 25 or so set up the Open Library code base, join the community slack channel, make contributions to the project, and submit applications. So if you're very dedicated and invest time meeting mentors and working with them to understand the codebase and the project's needs and problems, you're chances could be ~1/25!

# Drafting a Fellowship Proposal

## Sample

You can view a sample proposal template [here](https://docs.google.com/document/d/1FkKxvI6sbi7Nj42WdVmkHwiycPR3PR_VV44cwHPCOnM/edit#heading=h.z6ne0og04bp5).

## Example Proposal Concept

The following mock proposal is effective because it:
* Demonstrates the value of Open Library and the problem it helps solve
* Defines a very specific, focused problem and justifies its value in measurable terms
* Identifies open questions, risks, and concerns a mentor may have
* Proposes a detailed & feasible step by step plan, with justification behind design decisions, and directly address the risks & questions.
* Is specific enough that this can be handed to someone else and they'd be able to make progress towards the desired outcome
* Engineering knowledge is demonstrated about the codebase
* Product & design knowledge is demonstrated about the critical pieces required to produce a working product/prototype as well as original ideas
* Shows the mentor how they will know if the plan is successful

## Requirements

Your proposal should be **focused**, **thematic**, **realistic**, and **metric-driven**:

e.g.
- I believe [Theme] is important for Internet Archive and Open Library because...
- [Theme] is best measured by metric X because...
- I have an idea on how to increase X by Y%
- Here's evidence X can be increased by Y%
- Here's is my proposal for increasing X by Y% (diagrams? wireframes? architecture overview? features?)
- Here are the risks (what could go wrong)
- Here are my open questions (for mentors)

## General Advice

1. Your application **should not** just be a collection of issues. Group issues into logical themes. For instance, "my theme for phase one of my roadmap is making Open Library more accessible to people in non-US countries".
2. Ask lots of questions -- some of your ideas may be easy in principle, but hard because Open Library's code base can be difficult to work with, an issue may take longer than expected! Ask mentors how long they think an issue will take, it's one of the most important pieces of value they can offer.
3. Consider creating Open Library issues proposing features you'd like to include in your application. Get feedback from the community and see whether it's something they also value and will support.
4. Have an idea of what success means / looks like from the very beginning. How will you know if you've won? Brewster suggests one strategy is, "start with the aspirational blog post and work backwards".

## Choosing a Meaningful Theme

Depending on what you specifically valuable about Open Library, here is an example of what an application may say:

> The reason I am drawn to Open Library is I feel every country should have a library system. Right now, X countries don't have public library systems. As a result, I am designing a plan to increase the number of international users who visit Open Library and borrow books. First, we'll add an option to account creation that allows users to select their country and language (see issue #XXX on github)...

## What Does a Good Proposal Look Like?
A good summary addresses the following 6 questions (replace `Open Library` with whatever project you're applying for): 

1) What is Open Library, what is its importance to you, and how do you personally measure its impact?

> Open Library is a non-profit website run by Internet Archive which helps millions of patrons access digital library books for free. Not every library is equal. Some cities don’t have libraries at all. Open Library is an opportunity to provide equal opportunity to readers all over the globe. To me, success means extending the reach of Open Library so more people may access books who are currently without sufficient local libraries.

2) What **opportunity** exists for Open Library and how does it related to your impact metric?

The opportunity you mention should be directly related to the "solution" you reference in #5.

> Today, Open Library is limited to the books Internet Archive decides should be acquired and made available through their library program. But there’s an opportunity to democratize Open Library’s bookshelves and extend this power to patrons so every reader in the world may be empowered to Sponsor books of their choosing.

3) Why now? Why is this opportunity possible now (and wasn’t possible before?)

> Last year, Open Library added a Want to Read button to their website enabling patrons to tell us which books we are missing from the library. To our surprise, over 400k unique patrons clicked this button since we added it, teaching us that patrons are eager to tell us which books they want. I believe some percentage of these patrons may also be willing to make a monetary donation to sponsor the accessioning of these desirable books.

4) What does the solution look like?

> For GSoC, we’d like to test this hypothesis by adding a `Sponsor this Book` button that will show up on the 23M remaining books which Open Library knows about but have not yet been obtained.

5) What does success of your solution look like? What is the potential impact, who will benefit?

> Success means establishing a new distribution channel to receive donations, promoting long-term sustainability. We also hope to improve and democratize our holdings by empowering thousands of patrons to participate in book sponsorship.



### Open Library's Value & a Missed Opportunity

Open Library is an important platform because it helps underserved learners read library books online for free online. Most municipalities don't have as well funded libraries as NYPL and BPL and so the availability of digital reading options is a critical consideration. However, the library is currently missing an opportunity because hundreds of high quality born-digital educational web books (for instance, [this book on the Rust programming language](https://github.com/rust-lang/book) published on github) are not indexed in the catalog. This book has 12k :star: and there are many books like it, signifying there's a large audience (likely tens of thousands of patrons) interested in the subject matter.

### Challenges & Risks

As a reviewer, you may be wondering: How do we find or submit good web books? How do we evaluate the quality of a web book? Who will be allowed to submit web books and is there a review process? What technologies or processes are needed to make such an initiative possible? And is there a way we can build such a system so that the benefits will outweigh the risks and the time investment? Finally, what will the experience be like to search for and read web_books from Open Library? After talking to members of staff about their questions, I've also included any policy considerations which may need to be addressed when linking to external websites from Open Library?

### Proposal
In this proposal, I will address some of the above concerns, make a case for why this feature is paramount for us to work on, and recommend a clear and specific path forward which will address these questions, reduce uncertainty & risk, and promote confidence in a solution that will be both feasible, low-costs, and effective:

1. The /addbook page will be updated so any patron can submit the URL of a web book, along with some basic metadata to help reviewers assess the quality of the submission.
2. A privileged librarian will go to a new page called /review where (similar to the /merges UI) a librarian can evaluate the book's quality. Here is figma link to how this /review page might look:
design showing a table where the fields are: (ol_edition_key, web_book_url, reviewer=None, status="approved")
3. In order to ensure only high quality of books are approved, there will be a standard checklist guide written that librarians can use to see if the web book meets all the criteria. This guide will be one of the deliverables.
4. Today, Open Library book pages have a read or borrow button when a readable edition is available in the library. I propose we make this button more flexible to include web_books as an option and possibly convert it into a dropdown button (see img) because this will allow us to offer many different options, such as external links to the web_book
5. Finally, we would make sure that when a web_book is approved by a librarian, it will enter the solr search engine so that patrons can facet/search by web_books specifically or see when a web_book happens to be available in the catalog. For this I will refer to the [video tutorial on adding fields to solr](https://archive.org/details/openlibrary-tour-2020/2021-10-26-OpenLibrary-Community-Celebration.mp4) and make the necessary changes to the main backend [search code](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/worksearch/code.py) and the [search UI template](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/work_search.html) to make these changes.

### Evaluating Success

One might evaluate success in any number of ways. Here are some ideas, though careful as you'll want to justify and create a case for why these evaluation metrics are the right ones (either categorically and/or with respect to your specific proposal):
* how many times a patron clicks submits a web book
* how many times a librarian approves a submitted web_book
* how many times a web_book button has been clicked by a patron
