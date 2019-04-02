## GitHub Issues: Triage and Maintenance

*WIP: This is work in progress, super rough.  Do not rely on it yet.*

In order to keep the list of issues manageable and under control, the **Bug Triage Owner** (currently @brad2014) will go through the bugs weekly, and work with the team to make sure issues are getting assessed, categorized, assigned, and closed.  The labeling of issues coordinates closely with the project boards, giving us very simple project management.

## Assignee

As much as possible, each issue should have exactly **one** assignee, who "owns" the issue. The goal is to identify who we should turn to find out what is going on with that issue, and who should feel empowered to make decisions about how to resolve it (getting whatever buy-in or review is appropriate).  

Note: as an **owner** of an issue, you may or may not be doing the
work, you're simply causing it to get done.  It is fine to own
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

Every open issue/PR should have a label that indicates:

1. What kind of issue it addresses:

- `bug` An existing feature is broken.
- `enhancement` A new user feature to be added.
- `refactor` Existing code needs to be reworked, fixed or upgraded, without affecting user/ops features.

2.  What state is the issue in?
- `Needs info` Details of what is needed from whom go into the comments.
- `WIP` Work in progress.
- `Needs review` Work is done, looking for feedback, ready to pull/merge, etc.

3. How serious is it:
  - `Priority` A bug we need to address right away.
  - `Looking for Help` We don't have someone to work on it, but want to find a volunteer.
  - `Good first issue` Suitable for developers new to the team.

4. What part(s) of the code is it in, or data does it relate to?
  - `Doc-user`
  - `Doc-dev`
  - `Doc-ops`
  - `UI`
  - `UI-Accessibility`
  - `UI-Translations` (for i18n bugs and enhancements)
  - `Ops-Ingestion`
  - `Ops-Docker`
  - `Security` (mark all bugs that relate to privacy/security concerns)
  - `Backend-solr`
  - `Backend-infogami`
  - `Backend-api` (api's that support UI or Ops)
  - `Data-daisy`
  - `Data-marc`

5. Personal labels

  - Feel free to add your own labels, prefixed with your initials, to help you manage your own bugs.

  - Do not create labels without your initials, without changing the documentation to tell people how to use them.

Labels that begin with `~` are deprecated.

Labels that begin with initials are owned by that person (others should not touch them).  See #5, above.

## Milestones

We generally do planning by quarter, though issues are usually "very hot, must get done right now" or "later, when we find a volunteer".  So milestones are dated based on when we expect to close the corresponding issue:

- `ASAP`  We need to get it out the door As Soon As Possible.
- `2019Q1`, `2019Q2`, etc. Reminders to pick things up in upcoming quarters.
- `None` Interesting wish list items, waiting for a volunteer, endless conversations that should migrate to Gitter, etc.

## Triage:

We always have someone who is the current "bug triage" owner.
They are on the hook to assess each incoming bug:

1. Determine who the initial owner should be, based on the nature of the bug.  

2. Make any easy assessments, and if the bug seems hot, label it.

## Closing issues:

Closing issues is the most important "maintenance" to be done on the issues list.  Close issues with

1. Fixed: Do not close issues until the fix has been pushed to production (not simply when the code has been changed, or the fix has been merged).  PR's can be closed when they are pulled and merged to master.

2. Duplicate: In comments, note which issue it is a duplicate of. This also makes sense if fixing another issue will necessarily fix this one.

3. Won't Fix: Issue reports that we won't pursue. In comments, note if they are not clear, not reproducible, or we agree we don't want to address them (i.e. a feature request we decide is out of scope).

---
