# Labeling Issues

We reserve a set of labels for use with Github issues, to assist with issue handling and project management for OpenLibrary.

Most generally, an issue evolves through a series of states, for example: 

submitted -> assessed -> scheduled -> fixed -> closed.  

On the way down that path, lots of things can happen.  The labels below can be applied and removed during initial triage (either by the submitter, or by an initial triage), and thereafter by the owner of the bug.

The sections below contain:
- [Owners](#owners)
- [Milestones](#milestones)
- [Managed Labels By Group](#managed-labels-by-group)
    - [Type](#type)
    - [Priority](#priority)
    - [State](#state)
    - [Needs](#needs)
    - [Close](#close)
    - [Theme](#theme)
    - [Affects](#affects)
    - [Module](#module)
    - [Additional Lables](#additional-labels)
- [Personal Labels, Deprecated Labels](#personal-labels-and-deprecated-labels)
- [Tips for Filtering Issues and Updating Their Labels](#tips-for-filtering-issues-and-updating-their-labels)

## Owners

A note about owners: The top assignee of an issue is considered its *owner*. 

During submission and triage, the assigned owner is not necessarily the person who will fix the issue (it is not necessarily even established if or when the issue will be fixed at all), but rather they are the person who will do as much or as little as needed to handle the issue (asking questions, soliciting input, establishing and updating the priority, closing duplicates, etc). 

Most parts of the project have *leads*; issues in their area typically get assigned to them first (but can subsequently be handed off). The submitter of an issue is free to suggest an owner — indeed, developers occasionally create issues which they assign to themselves). 

Any open bug that is unowned is in need of triage.

## Milestones

Much of our work is done by volunteers. So we plan very lightly, by year and by quarter, given the resources we have available. As new volunteers join, plans may change to accommodate their skills and interests.

Things we'd like to get done during a given year get the milestone for that year, e.g. "2019".  For things we expect to be done in by the end of a given quarter, we apply the quarterly milestone, e.g. "2019 Q1" for things to get done on or before March 31, 2019.

If a milestone deadline passes, whatever is not done gets rescheduled or [backlogged](#state).

## Managed Labels By Group

Labels are grouped by prefix and color. If you create a label outside the managed set, prefix it with your initials and give your personal labels a common color. We are continually evolving the managed set to meet our needs. If you think a label deserves to be in the managed set, just mention it.

The labels are grouped into different axes for slicing and dicing issues:

### Type:

What kind of issue this is.  Is it something that is broken that should (perhaps) be fixed, or is it a request for a new feature or enhancement, or is it a reminder to reorganize or cleanup some aspect of the code base?

Color|Label|Description 
-|-|-
![ff9900](https://via.placeholder.com/30x30/ff9900/ff9900.jpg) | **Type: Bug** | Something isn't working. [managed]
![e08000](https://via.placeholder.com/30x30/e08000/e08000.jpg) | **Type: Epic** | A feature or refactor that is big enough to require subissues. [managed]
![ff9900](https://via.placeholder.com/30x30/ff9900/ff9900.jpg) | **Type: Feature** | Issue describes a feature or enhancement we'd like to implement. [managed]
![ff9900](https://via.placeholder.com/30x30/ff9900/ff9900.jpg) | **Type: Refactor/Cleanup** | Issues related to reorganization/clean-up of code (e.g. for maintainability). [managed]
![ff9900](https://via.placeholder.com/30x30/ff9900/ff9900.jpg) | **Type: Subtask of Epic** | A subtask that is part of the work breakdown of an epic issue (see comments). [managed]

### Priority:

Priority describes how urgent the bug is. Very urgent bugs generally have an active conversation on the slack channel, so that they can be fixed right away.

Color|Label|Description 
-|-|-
![d12f29](https://via.placeholder.com/30x30/d12f29/d12f29.jpg) | **Priority 0: Urgent** | Issues that prevent users from using the site, or that corrupt site data. [managed]
![ff8899](https://via.placeholder.com/30x30/ff8899/ff8899.jpg) | **Priority 1: High** | Issues that we should be working on now. [managed]
![ff8899](https://via.placeholder.com/30x30/ff8899/ff8899.jpg) | **Priority 2: Normal** | Optional label: neither high nor low priority. [managed]
![ff8899](https://via.placeholder.com/30x30/ff8899/ff8899.jpg) | **Priority 3: Low** | Issues that we can consider at our leisure. [managed]

### State:

Use these labels to distinguish between issues that we're actively working on, those that we plan to work on, and those that seem to be good ideas that we'll consider when we have the additional time and resources required.  If no state label is present, the issue needs assessment.  If someone was working on an issue but had to set it aside, the state label might be changed to "Backlogged," or the current owner might find someone to hand it off to, or it might even be closed (if we decide it didn't need to be addressed after all).

If an issue is "State: Scheduled", it must have a milestone that indicates by when it is scheduled to be completed. We plan by quarters, so "2019 Q1" means it is an issue we expect to resolve on or before March 31, 2019.

Color|Label|Description 
-|-|-
![e07cf9](https://via.placeholder.com/30x30/e07cf9/e07cf9.jpg) | **State: Backlogged** | No one working on it, not in any milestone, but want to leave open to consider later. [managed]
![e07cf9](https://via.placeholder.com/30x30/e07cf9/e07cf9.jpg) | **State: Scheduled** | A decision has been made that this issue should be addressed. [managed]
![e07cf9](https://via.placeholder.com/30x30/e07cf9/e07cf9.jpg) | **State: Work In Progress** | This issue is being actively worked on. [managed]

### Needs:

These labels indicate that an issue or pull request is stuck because the owner needs someone to respond - they'll add comments to the issue saying what exactly they need.  Remember to remove this label once the need is met and the issue is unstuck.

Color|Label|Description 
-|-|-
![0052cc](https://via.placeholder.com/30x30/0052cc/0052cc.jpg) | **Needs: Assessment** | This issue needs triage. The team needs to decide who should own it, what to do, by when. [managed]
![0052cc](https://via.placeholder.com/30x30/0052cc/0052cc.jpg) | **Needs: Breakdown** | This big issue needs a checklist or subissues to describe a breakdown of work. [managed]
![0052cc](https://via.placeholder.com/30x30/0052cc/0052cc.jpg) | **Needs: Detail** | Submitter needs to provide more detail for this issue to be assessed (see comments). [managed]
![0052cc](https://via.placeholder.com/30x30/0052cc/0052cc.jpg) | **Needs: Review** | This issue/PR needs to be reviewed in order to be closed or merged (see comments). [managed]

### Close:

Issues typically lead to pull requests to modify the repo in order to resolve the bug.  
It is considered good form, immediately prior to closing a bug, to add a label indicating if it was closed for any of the following reasons.

Color|Label|Description 
-|-|-
![cfd3d7](https://via.placeholder.com/30x30/cfd3d7/cfd3d7.jpg) | **Close: Duplicate** | This issue or pull request already exists (see comments for pointer to it). [managed]
![cfd3d7](https://via.placeholder.com/30x30/cfd3d7/cfd3d7.jpg) | **Close: Not Reproducible** | Closed because we cannot reproduce the issue. [managed]
![cfd3d7](https://via.placeholder.com/30x30/cfd3d7/cfd3d7.jpg) | **Close: Not an Issue** | Questions and discussions resolved or moved to gitter/slack. [managed]
![cfd3d7](https://via.placeholder.com/30x30/cfd3d7/cfd3d7.jpg) | **Close: Will Not Fix** | Closed because we have decided not to address this (e.g. out of scope). [managed]

### Theme:

There are some issues that affect multiple modules, or are related to a user story or workflow that touches multiple systems, and we use "theme" labels to identify them.  This list is expected to grow.

Color|Label|Description 
-|-|-
![2eb8db](https://via.placeholder.com/30x30/2eb8db/2eb8db.jpg) | **Theme: Accessibility** | Work related to disability accessibility. [managed]
![2eb8db](https://via.placeholder.com/30x30/2eb8db/2eb8db.jpg) | **Theme: Design** | Issues related to UI design, branding, etc. [managed]
![2eb8db](https://via.placeholder.com/30x30/2eb8db/2eb8db.jpg) | **Theme: Python3** | Work related to the transition from Py2 to Py3. [managed]
![2eb8db](https://via.placeholder.com/30x30/2eb8db/2eb8db.jpg) | **Theme: Testing** | Work related to tests that need to be written or fixed. [managed]
![2eb8db](https://via.placeholder.com/30x30/2eb8db/2eb8db.jpg) | **Theme: Translation** | Work related to language accessibility. [managed]

### Affects:

The broad area this issue is related to, often suggesting who first should consider it.

Color|Label|Description 
-|-|-
![fcbe9f](https://via.placeholder.com/30x30/fcbe9f/fcbe9f.jpg) | **Affects: Configuration** | Issues related to system configuration (production, staging, or development). [managed]
![fcbe9f](https://via.placeholder.com/30x30/fcbe9f/fcbe9f.jpg) | **Affects: Data** | Issues that affect book/author metadata or user/account data. [managed]
![fcbe9f](https://via.placeholder.com/30x30/fcbe9f/fcbe9f.jpg) | **Affects: Documentation** | Issues related to developer or ops or data documentation. [managed]
![fcbe9f](https://via.placeholder.com/30x30/fcbe9f/fcbe9f.jpg) | **Affects: Maintenance** | Issues relating to support scripts, bots, cron jobs and admin web pages. [managed]
![fcbe9f](https://via.placeholder.com/30x30/fcbe9f/fcbe9f.jpg) | **Affects: Mobile** | Affects the responsive UI on mobile devices. [managed]
![fcbe9f](https://via.placeholder.com/30x30/fcbe9f/fcbe9f.jpg) | **Affects: Server** | Issues with the server or its plugins. [managed]
![fcbe9f](https://via.placeholder.com/30x30/fcbe9f/fcbe9f.jpg) | **Affects: UI** | The issue is focused on the User Interface. [managed]

### Module:

These labels identify the specific module or service that the issue relates to. Often this corresponds to a particular directory in the repo hierarchy. This list is expected to grow.

Color|Label|Description 
-|-|-
![c2e0c6](https://via.placeholder.com/30x30/c2e0c6/c2e0c6.jpg) | **Module: Accounts** | Issues related to authentication, account maintenance, etc. [managed]
![c2e0c6](https://via.placeholder.com/30x30/c2e0c6/c2e0c6.jpg) | **Module: Memcache** | Issues related to memcache, memcached, cache invalidation, cache corruption, etc. [managed]
![c2e0c6](https://via.placeholder.com/30x30/c2e0c6/c2e0c6.jpg) | **Module: Solr** | Issues related to Solr, data indexing, search, etc. [managed]

### Additional labels

A few remaining labels that are not in any group, because of github conventions, or for other reasons.

Color|Label|Description 
-|-|-
![7057ff](https://via.placeholder.com/30x30/7057ff/7057ff.jpg) | **Good First Issue** | Easy issue. Good for newcomers. [managed]

## Personal Labels and Deprecated Labels

If you have a large number of issues assigned to you, there may be times when you want to divide them into groups by your own criteria.  You can do this by creating your own labels.  They all go into the repository label set, so we ask that you:

- pick your own color that you apply to all your personal labels, and

- prefix the label name with your initials.

For example, Chris Horn has labels with prefix `CH: ` and color #1d76db.

Labels that are grey and start with a tilde `~` are *deprecated*.  They typically are not used much, and shouldn't be added to issues going forward.

## Tips for Filtering Issues and Updating Their Labels

- The default [issues page](/internetarchive/openlibrary/issues) presents several search fields.  There is one at the very top, for searching the repository or all of github. There is another one under the `issues` tab that searches through the issues.  To the right of the issues filter is the labels button, which gives you a "labels list" to browse and drill down to issues.  <img width="600" alt="Issues Page Snippet" src="https://user-images.githubusercontent.com/6502462/57257705-7bece100-705a-11e9-8272-3879419dedd3.png">

- You can type a label search term directly into the issues filter search field, you type `label:<labelname>` to include issues containing the label, and `-label:<labelname>` to exclude issues containing that label.  Because all the managed label names contain spaces and colons, you need to quote them if you are typing them directly into the issue search bar.  For example, `label:"affects: documentation"` (case doesn't matter).

- If the issues filter field contains multiple labels terms, you will see the issues that match *all* those label terms. There is no way to see a list issues that contain label A *or* label B.

- If you're not sure exactly what the label is, just use the labels pull down, and in its search bar type any word that is in the label name or description, and the matches will be displayed.  Click on the labels you want to add to your issues filter.

- All the managed labels have `[managed]` in their description, so an easy way to browse just the managed labels is to search labels on that string. 

- It is easy (and sometimes dangerous) to do batch updates of labels (or milestone, or assign, or close).  Just filter the issues to the ones you want to change, select the issues you want to label. When you select one or more issues, the pulldown menu changes from filter mode to update mode. Pull down the label menu, and you can select which labels you want to add or remove (it's a toggle). <br/><img width="600" alt="issues list in update mode" src="https://user-images.githubusercontent.com/6502462/57258627-439ad200-705d-11e9-8cca-adf8e45f44d0.png">