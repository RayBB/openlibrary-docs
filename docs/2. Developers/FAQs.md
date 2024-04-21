# Frequently Asked Questions (FAQs)
## Getting Started

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

## Debugging & Testing

- [How do I manually test whether a python function I've written works as expected?](https://github.com/internetarchive/openlibrary/wiki/Recipes#magic-incantation-accessing-webctx)
- How do I write [tests](https://github.com/internetarchive/openlibrary/wiki/Testing)?

## [Understanding the Application](https://archive.org/details/openlibrary-tour-2020/technical_overview.mp4)

- [How does routing work on Open Library?](https://github.com/internetarchive/openlibrary/wiki/Frontend-Guide#the-lifecycle-of-a-network-request)

### Understanding the Codebase

- [Where do I find data models, template files (views), and routers (controllers)](https://github.com/internetarchive/openlibrary/wiki/Frontend-Guide#file-organization-overview)? 
- [How are controllers/routers organized?](https://github.com/internetarchive/openlibrary/tree/master/openlibrary/plugins#understanding-directories)
- [Where can I see an overview of what routes exist and what they do?](https://github.com/internetarchive/openlibrary/wiki/Endpoints#list-of-all-routes)

### Understanding the Tech

- How does an infogami + webpy application work (overview)?

## Librarian Resources

- How do I register new book identifier types in Open Library?

## Design

- Where do I find Open Library's design system?

## Internationalization (i18n) & Translations

- [How do I contribute a language translation to Open Library?](https://github.com/internetarchive/openlibrary/wiki/Internationalization-Contributor's-Guide-(i18n))


## FAQs

**Question:** Why do I hit a 404-page on local when the page shows up on openlibrary.org site?

**Answer:** Check out the answer for this here: https://github.com/internetarchive/openlibrary/issues/1864


***
**Question:** What should I do to find the endpoints/files relating to the components I want to contribute to?

**Answer:** https://dev.openlibrary.org/developers/routes - can be found here

**Issue link:** For a full description see: https://github.com/internetarchive/openlibrary/issues/1865


***
**Question:** What should I do when book covers won't load locally?

**Answer:** This can be resolved by going to conf/openlibrary.yml and changing `coverstore_url` to https://covers.openlibrary.org

**Issue link:** For a full description see: https://github.com/internetarchive/openlibrary/issues/1897

# Using the local Open Library Website

<a name="logging-in"></a>
## Logging In

You can log into the Open Library instance as an admin 

```
Username: openlibrary@example.com
Password: admin123
```

<a name="admin-interface"></a>
## Admin Interface

For users with sufficient privileges, an admin interface is available at http://localhost:8080/admin.

<a name="creating-users"></a>
## Testing the site with different users

| **WARNING: This section is very out of date and needs to be re-written. |
| -- |

To view and test the site as a non-admin user:

1) Log into your local dev instance (http://localhost:8080) as the openlibrary@example.com admin user.
2) Enter the admin interface URL: http://localhost:8080/admin and select the `People` option (http://localhost:8080/admin/people)
3) Select the user `AccountBot` from the "Recent Accounts" table.
4) At the top of the user page (http://localhost:8080/admin/people/AccountBot) there will be two red buttons -- click on "login as this user".

You should now be logged in as a standard user, `AccountBot`, and will be able to make edits, but not delete items etc.

To add AccountBot to a specific usergroup, such as `librarians`:

As the admin user openlibrary@example.com;

1) Open the `librarians` usergroup page in edit mode: http://localhost:8080/usergroup/librarians?m=edit
2) Add `/people/AccountBot` in the first "Members" slot and save the page.

Now you should be able to login as AccountBot using the instructions above and operate as a librarian.

<a name="lending-and-borrowing"></a>
## Lending and Borrowing

| **WARNING: This section is very out of date and needs to be re-written. |
| -- |

These instructions are fairly specific to Internet Archive staff who are administrating the Open Library service and who have access to the production olsystem repository.

It essentially enables your local developer repository to behave as if it were actually openlibrary.org, and thus sync with and to openlibrary.org's loans:

To enable lending on localhost check [this](https://github.com/internetarchive/olsystem/blob/master/Readme.md#enabling-lending-on-localhost)

<a name="configuration"></a>
## Configuring

Various configuration options can be found in conf/openlibrary.yml

Add conf/openlibrary.yaml to .git/info/exclude so that any changes to the conf file do not show up as dirty on git.

**Book covers**

By default, uploading book covers will work in the local development environment, but some of the existing books might 404 for their covers. This is expected, since now actual images are included in the test database.

If you use copydocs (see below) to import books, these imported books will also 404 on their covers. For these, you can change `coverstore_public_url` in `conf/openlibrary.yml` to https://covers.openlibrary.org/ . This will change the web page to fetch covers from production instead of your local environment.

Be sure to restart your dev instance after any configuration changes.
