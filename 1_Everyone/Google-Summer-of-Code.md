[**Apply to Google Summer of Code**](https://summerofcode.withgoogle.com/programs/2024/organizations/internet-archive)

[**See Open Library's GSoC 2024 Proposal**](https://docs.google.com/document/d/1Wh3tAxS4T9eKLa5x8iILft964v8zriaq-hKcu300Lg4/edit#heading=h.mn497pr3rien)

---

* **[Welcome](#Welcome)**: [History](#History) | [Your Chances](#Your-Chances) | [Advice for Contributors](#Advice-For-Contributors)
* **[Drafting a Proposal](#Drafting-a-Proposal)** | [Requirements](#Requirements) | [Walkthrough](#Walkthrough) | [Sample](#Sample) | [Tips](#Tips)
* **[](#)**

# Welcome

Google Summer of Code (GSoC) is a global program (paid mentorship program) focused on bringing more developers into open source software development. Contributors with an open source organization on a 3 month programming project during their break from school. You can read more [on Google's GSoC website](https://summerofcode.withgoogle.com). The program is run by Google, which selects aligns organizations to mentor contributors on projects.

Candidates [see eligibility requirements](https://buildyourfuture.withgoogle.com/programs/summer-of-code) apply by submitting an application to one or more participating/mentoring organization. Open Library GSoC projects may span everything from writing bots to imports or organize books, to new crowd-source programs which allow patrons to fund and sponsor books they love for the library.

## History

Internet Archive has participated in Google Summer of Code for 3+ years. Open Library has participated twice (2018, 2020). In 2019, the Internet Archive did not receive enough slots for Open Library to participate and so we designed and ran our own Internet Archive Summer of Code (IASoC) internship.

## Your chances

Each year, the Internet Archive applies as an organization to participate in Google Summer of Code and most years we're accepted: we don't know in advance how many seats we will be awarded by Google. We first endorse certain proposals, google tells us how many seats the entire organization gets, and the Wayback Machine, Open Library, and Archive.org divide seats as available. Some years this means Open Library may not get a seat even if the Internet Archive is participating, but most years Open Library has received a seat (our team has worked with ~5 GSoC applicants).

Assuming Open Library is given a GSoC seat: Typically, hundreds of candidates email us to inquire about GSoC. 25 or so set up the Open Library code base, join the community slack channel, make contributions to the project, and submit applications. So if you're very dedicated and invest time meeting mentors and working with them to understand the codebase and the project's needs and problems, you're chances are ~4% (1/25).

## Advice for Contributors

An essay on the topic by @mekarpeles: https://www.facebook.com/michael.karpeles/posts/10103690294172760

We **love** when folks are passionate and eager to participate! I'd like to offer some tips on how one might use eagerness to their advantage (because it's also possible for eagerness to work against us).

It can be tempting to demonstrate enthusiasm by showing we can jump into many different issues at once. However, one secret is: context switching across multiple projects is incredibly costly—for both contributors & staff.

**Example:** Imagine being the only chef in a restaurant and there are 800 patrons who want to be fed different meals from a menu with 10 recipes. We could offer to cook for every patron at the same time, but then you may need to know 10 different recipes, switch between chopping / simmering / sautéing / baking / plating, making sure no one waits too long, that tables get their meals together, that no sauce gets burned, no ingredient gets missed, and that no dish is cold. And that patrons are happy with their meal (because otherwise it may get sent back and disrupt all the other dishes you're working on).

In my experience (both in terms of making a bigger impact and gaining more experience), being given the opportunity to focus on a specific part of a project can both help a contributor better understand how each parts integrates together and allows us to align & stack our victories together to achieve greater impact.

We get a lot of confidence when a contributor:
* asks to work on an issue because it is part of a thought out plan, that they are able to execute on.
* asks a clarifying question because the requirements are unclear or something seems strange about the approach

One issue done well shows us a contributor:
* has the ability to prioritize and strategically plan: to evaluate and identify which issues (and their parts) are important to the project and achievable to them
* takes the time upfront to understand the issue and clarify questions before developing a solution that doesn't achieve the desired outcome
* respects staff time by trying to make issues easier to review, following instructions, including screenshots, testing their code, maybe even asking chatgpt for feedback on their code before submitting (using tools available to them)

# Drafting a Proposal

We're not looking for you to have all the answers. We're looking for honesty, integrity, and well reasoned ideas that are achievable to implement and demonstrate that you have these [fellowship qualities](#Fellowship-Qualities)

## Requirements

Your proposal should be **focused**, **thematic**, **realistic**, **timely**, **high-impact**, and **metric-driven**:

e.g.

- I believe right now the Internet Archive's Open Library needs to focus on [Theme] because [Impact]...
- [Theme] is best measured by metric X because...
- Now is the right time [timely] to work on [Theme] because [impact]
- I have a [realistic] idea on how to increase X by Y%
- Here's my supporting evidence this idea will increase X by Y%
- Here's is my proposal for increasing X by Y% (diagrams? wireframes? architecture overview? features?)
- Here are the risks (what could go wrong)
- Here are my open questions (for mentors)

## Walkthrough

What Does a Good Proposal Look Like?

A good proposal:
- Defines a very specific, focused problem and justifies its value in measurable terms
- Demonstrates the value of Open Library and the problem it helps solve
- Identifies open questions, risks, and concerns a mentor may have (it's okay for there to be risks and valuable for us to know you are someone who thinks about and can identify risks!)
- Proposes a detailed & feasible step by step plan, with justification behind design decisions, and directly address the risks & questions.
- Is specific enough that this can be handed to someone else and they'd be able to make progress towards the desired outcome
- Engineering knowledge is demonstrated about the codebase
- Product & design knowledge is demonstrated about the critical pieces required to produce a working product/prototype as well as original ideas
- Shows the mentor how they will know if the plan is successful

A good proposal addresses the following 5 questions (replace `Open Library` with whatever project you're applying for):

1. What unique **opportunity** is Open Library missing and what is the potential impact?

What's more important than the impact being impressive is that it's realistic, well calculated, and that the type of value is well aligned with our library mission.

> Today, Open Library catalog is limited to books the Internet Archive decides to acquire and make available through their library program. But there’s an opportunity to democratize Open Library’s bookshelves and extend this power to patrons so every reader in the world may be empowered to Sponsor books of their choosing. There are 10M patrons using Open Library and if even .05% (half a percent) donated a book, that would add 50,000 books. Some sources suggest an average paperback book costs [~$10 USD](https://www.bookbrunch.co.uk/page/free-article/rrps-are-rising--but-books-have-never-been-cheaper/#:~:text=An%20analysis%20of%20the%20top,%C2%A39.54%20to%20%C2%A310.38.) so this program could generate $.5M of book value for the community.

2. Why is now the ideal time for this opportunity (as opposed to another time?)

Give us confidence by showing us evidence: have other organizations succeeded at doing something similar? Has some discovery or change in the world made something new possible? 

> Last year, Open Library added a Want to Read button to their website enabling patrons to tell us which books we are missing from the library. To our surprise, over 400k unique patrons clicked this button since we added it, teaching us that patrons are eager to tell us which books they want. I believe some percentage of these patrons may also be willing to make a monetary donation to sponsor the accessioning of these desirable books.

3. What does the solution look like?

Start with an initial paragraph that provides a very clear, concise, short overview of the solution before going into the details. Flowcharts or architectural diagrams, designs, and other aids may be helpful.

> For GSoC, I propose adding a `Sponsor Book` button that will show up on the 23M books on Open Library that are not yet readable. This button will connect to a minimal UX flow for sponsoring a book that I've [diagramed]. I've also [diagramed] approximately what the code flow will look like to implement this, with relevant services, data stores, APIs, URLs, files, and functions referenced.

See also the [Bonus Proposal](#Bonus-Proposal) below for a more detailed example of a good "solution".

4. What gives you confidence your solution is possible and achievable? What are the risks and challenges and how might we address them?

Show that you have the relevant experience or skills, understand the risks, and can problem solve. Identifying risks is only a good thing because the risk will exist whether acknowledged or not. Risks that are missed or brought up later in the process are some of the biggest threats to the success of your proposal.

> In a previous job, I engineered a marketplace checkout flow and based on the flow I'm proposing, this will be very similar. A patron will click a button to sponsor a book, be brought to amazon to buy the book, and then enter Internet Archive has their shipping address. One challenge will be whether patrons get confused by the user experience and if they may forget to change the address. I propose we first prioritize integration of a minimal working system and then get feedback from a few patrons to see if this is an issue, and then consider whether a tighter integration  may be a better approach (e.g. perhaps the patron donates the funds and then we try to automate submitting of these orders on their behalf). This also has risks, depending on when the donation is made, if there are chargebacks, or if the book price changes between time of donation and purchase. We may also want to consider whether there's a review process for sponsoring a book, if certain books shouldn't be eligible for sponsorship, and if there are any policy considerations we may wish to discuss (e.g. should we restrict to certain date ranges or topics?).

5. Evaluating success: If your proposal is successful, how will you know? What does success look like [as a metric] and what positive change does bring?

> Success means establishing a new distribution channel to receive donations, promoting long-term sustainability. We also hope to improve and democratize our holdings by empowering thousands of patrons to participate in book sponsorship. Success looks like 1000 new books that were previously unavailable becoming available for the world and patrons having a way to crowdfund books that may otherwise be inaccessible to them. It hopefully inspires other libraries to try similar programs where patrons have the ability to more directly impact library holdings, which strengthens the whole library ecosystem. We will want analytics in place to see how often the `Sponsor` button is clicked versus how often it converts, as a baseline for how much time we invest supporting the feature. 

## Sample

You can view a sample proposal template [here](https://docs.google.com/document/d/1FkKxvI6sbi7Nj42WdVmkHwiycPR3PR_VV44cwHPCOnM/edit#heading=h.z6ne0og04bp5).

## Tips

1. Your application **should not** just be a collection of issues. Group issues into logical themes. For instance, "my theme for phase one of my roadmap is making Open Library more accessible to people in non-US countries".
2. Ask lots of questions -- some of your ideas may be easy in principle, but hard because Open Library's code base can be difficult to work with, an issue may take longer than expected! Ask mentors how long they think an issue will take, it's one of the most important pieces of value they can offer.
3. Consider creating Open Library issues proposing features you'd like to include in your application. Get feedback from the community and see whether it's something they also value and will support.
4. Have an idea of what success means / looks like from the very beginning. How will you know if you've won? Brewster suggests one strategy is, "start with the aspirational blog post and work backwards".

# Selection Process

When evaluating GSoC candidates, we create a table and individually rank proposals on a scale of 1-5. We dark out our scores so that other mentors are not influenced by our scores while performing their own independent evaluations. When all staff have voted, we tally up the results and discuss the top candidates.

While evaluating, staff considers aspects like whether the applicant demonstrates [Fellowship Qualities](#Fellowship-Qualities) and satisfies the [Fellowship Checklist](#Fellowship-Checklist):

## Fellowship Qualities

When selecting fellows, we try to identify individuals who demonstrate:
* **Initiative**: proactively moving a project forward by doing what one can, even if there are blockers.
* **Strategy**: choosing issues that are both impactful for the project and also part of some thoughtful greater plan.
* **Ability to Prioritize**: discerning which elements of an issue are critical to invest time on v. just to get done (or asking if it's not clear), not taking on too much, factoring in how long things will take
* **Problem Solving**: Figuring out how things work
* **Communication**: asking as soon as one is blocked or needs help understanding how something works, with the right context and steps one has taken, and taking notes so others can also learn.

## Fellowship Checklist

* [ ] Follows code of conduct and demonstrates commitment to the open source ethos
* [ ] Demonstrates ability to complete technical tasks mentioned in their proposal
* [ ] Has produced a roadmap that is defensible, specific, focused, practical, impactful, and achievable
* [ ] Has performed research and produced effective aids such as schemas, mockups, designs, or diagrams to demonstrate how their solution works and that their solution will work
* [ ] Demonstrates understanding or sensitivity to real world limitations, risks, and costs of potential solutions (e.g. budget, compute needs, accuracy of models, potential bias of solutions, etc), as well as potential solutions
* [ ] Demonstrates ability to organize, strategize, prioritize, and time manage
* [ ] Respects staff's time by communicating effectively and not adding lots of "filler" paragraphs
* [ ] Provides concrete solutions, not generic, indefensible, broad-sweeping, unqualified solutions like "will be solved using machine learning"

**Good luck!**

## Bonus Proposal

Proposals don't need to be long and they don't need to be for GSoC. Here's an example of a proposal that would make a great issue on our github:

```
Open Library is an important platform because it helps underserved learners read library books online for free online -- many municipalities don't have as well funded libraries as NYPL and BPL and so the availability of digital reading options is a critical consideration. The Open Library catalog, however, is currently missing hundreds of high quality born-digital educational web books (for instance, [this book on the Rust programming language](https://github.com/rust-lang/book) published on github) are difficult to discover because they're not indexed or catalogued many places online. This book has 12k :star: and there are many books like it, signifying there's a large audience (likely tens of thousands of patrons) interested in the subject matter. Open Library already has a large patron-base and so adding support for books like these could have a big impact both for patrons and the authors of these high quality web books.

Proposal for a low-cost and effective program that will allow librarians on Open Library to propose linking books to URLs for open access readable editions online:

1. The /addbook page will be updated so any patron can submit the URL of a web book, along with some basic metadata to help reviewers assess the quality of the submission.
2. A privileged librarian will go to a new page called /review where (similar to the /merges UI) a librarian can evaluate the book's quality. Here is figma link to how this /review page might look:
   design showing a table where the fields are: (ol_edition_key, web_book_url, reviewer=None, status="approved")
3. In order to ensure only high quality of books are approved, there will be a standard checklist guide written that librarians can use to see if the web book meets all the criteria. This guide will be one of the deliverables.
4. Today, Open Library book pages have a read or borrow button when a readable edition is available in the library. I propose we make this button more flexible to include web_books as an option and possibly convert it into a dropdown button (see img) because this will allow us to offer many different options, such as external links to the web_book
5. Finally, we would make sure that when a web_book is approved by a librarian, it will enter the solr search engine so that patrons can facet/search by web_books specifically or see when a web_book happens to be available in the catalog. For this I will refer to the [video tutorial on adding fields to solr](https://archive.org/details/openlibrary-tour-2020/2021-10-26-OpenLibrary-Community-Celebration.mp4) and make the necessary changes to the main backend [search code](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/worksearch/code.py) and the [search UI template](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/work_search.html) to make these changes.
```



