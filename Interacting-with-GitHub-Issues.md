## GitHub Issues: Triage and Maintenance

*WIP: This is work in progress, super rough.  Do not rely on it yet.  Suggestions to @brad2014*

We drive most of our work on the OpenLibrary project off [GitHub Issues](https://github.com/internetarchive/openlibrary/issues) in the InternetArchive/OpenLibrary GitHub repo)[https://github.com/internetarchive/.

In order to keep the list of issues manageable and under control, the **Bug Triage Owner** (currently @brad2014) will go through the bugs weekly, and work with the team to make sure issues are getting assessed, categorized, assigned, and closed. The labeling of issues coordinates closely with the project boards, giving us very simple project management.

This page briefly outlines our currently policies regarding intake, assignment, labeling of issues. Particularly if you are a developer, we invite you to give it a read.

## Slicing and Dicing

We triage issues by assigning labels, milestones, and moving them around project boards:

1. **Priority:** Level of urgency or alarm: urgent, high or low. Production outage and data corruption are typically urgent.

2. **Type:** - What kind of issue is it?  Bug? Feature request? Epic (a high-level issue with multiple subissues)?

3. **State:** Where is the issue in the pipeline?  Is it under assessment, planned, actively being worked on, stuck?  If stuck, what does it need to get unstuck? (e.g. 

4. Where the issues sits, organizationally. Generally useful slices, so developers can pick out the issues they are interested in.

    a. **Affects:** What kind of assets are affected?  metadata, accounts, docs, frontend/ui code, backend/server code, production ops, etc.

    b. **Modules:** JS/CSS, Pages, API, Solr, Memcache, Infogami, Database, etc.  These usually imply who the assignee is (we have deputies for the various modules and subsystems of OpenLibrary)

    c. **Themes:** Big, module-independent themes and initiatives, typically off the yearly plan goals.  E.g. the move to python3, UI design, testing, etc.

## Intake

If you are a developer filing an issue to represent something you are working on, feel free to assign it to yourself and give it a type and priority.

Otherwise, new bugs get reviewed by the *Bug Triage Owner* weekly, who can chat with developers to see how issues should be handled.  We are mostly volunteers — non-urgent issues generally wait until someone is interested and available to deal with them. We welcome volunteers: computer technical, library technical, non-technical, all!

## Titles matter

As a developer working on an issue, consider starting by editing the title from what the submitter thinks it is to what you realize it should be.  Often this will involve reframing the issue, and adding detail to the title.

It is helpful to the project managers if titles clearly indicate what it would take to close the issue.  We should constantly push ourselves to close issues (so that the pile of open issues doesn't increase without bound).  So instead of generic "such-and-so doesn't work", make the title more specific to "Fix the *thingy* so *such-and-so* does *this*".


## Assignee

As much as possible, each issue should have exactly **one** assignee, who "owns" the issue. The goal is to identify who we should turn to find out what is going on with that issue, and who should feel empowered to make decisions about how to resolve it (getting whatever buy-in or review is appropriate).  

Note: as an **owner** of an issue, you may or may not be doing the
work, you're simply causing it to get done. It is fine to own
things that you are not working on now, but intend to work on
later.

Issue ownership should be taken, not given. Don't assign issues
to others without their knowledge and consent.  Feel free to take
ownership of issues you submit, when that's appropriate.

If multiple folks are working together to solve a problem, use
@mentions in the issue comments, or if it is really complicated,
create a subissue to be owned by another person. Don't forget to
mention the parent issue in the first comment.

An issue without an owner is not being worked on.

## Labels for Issues and Pull Requests

We try to keep the set of labels organized and under control. Talk
to the "label owner" if a generally useful label needs to be added,
and we'll document it here. You may freely add your own labels,
just make sure they are prefixed with your initials.

[Managed Labels](https://github.com/internetarchive/openlibrary/wiki/Managed-Labels) are used for triage and project management. 

Note the following:

1. **The label's label (!) matters.** Each label starts with a **prefix** that groups the labels into sorted list. Labels prefixed with "~" are deprecated.  Labels prefixed with a developer's initials are managed by that developer (for their own purposes).

2. **Label color matters.**  Each prefix has a common hue (developers, pick your hue!). Generally, the prefixes are orthogonal (an issue can only have one *Priority*, only one *Type*, from the managed set).  So if you see an issue with more than label of a given hue, something might be awry.  Labels get reduced color saturation (greyed out) labels to indicate they are deprecated. Lower color values (whiter) typically suggest reduced urgency.  The label text also has these indicators, for accessibility (since not everyone sees all the colors). 

3. **Be careful** touching labels on issues belonging to others! People are using the labels to actively manage their activity. You can add and remove labels from an issue:

    a.  At the time you submit the issue, as the submitter.

    b.  The assignee/owner of an issue can label it as they see fit, using their own labels, and using managed labels according to the guidelines.

    c.  The Bug Triage Owner will adjust issues during triage.

    d.  Deputies will review and adjust labels as needed for issues in their area.

    e.  If you're not sure, ask the issue owner, the @brad2014, or @mek.  (The comment stream of the issue, or the slack channel are great places to raise these questions).

## Milestones

We generally do planning by quarter, though issues are usually "very hot, must get done right now" or "later, when we find a volunteer".  So milestones are dated based on when we expect to close the corresponding issue:

- `Unbreak Now`  We need to get it out the door As Soon As Possible.  These are typically "Priority 1: Urgent" issues.
- `Next 2 Weeks`  Issues that we expect to be completed shortly.  They are either actively being worked on, or have a developer committed to working on them.
- `2019Q1`, `2019Q2`, etc. Reminders to pick things up in upcoming quarters.
- `None` Interesting wish list items, waiting for a volunteer, endless conversations that should migrate to Gitter, etc.

## Triage:

We always have someone who is the current "bug triage" owner.
They are on the hook to assess each incoming bug:

1. Determine who the initial owner should be, based on the nature of the bug.  

2. Make any easy assessments, and if the bug seems hot, label it.

## Closing issues:

Closing issues is the most important "maintenance" to be done on the issues list.  When you close an issue, use one of the managed labels (e.g. "Close: Not reproducible") to mark the reason.

---
