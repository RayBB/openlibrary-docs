So you're a new contributor trying to contribute to the Open Library codebase and you don't know where to begin.

## Prerequisites
This guide assumes you have already found a good first issue on github, have familiarized yourself with git fundamentals and have created a new branch that is up-to-date with Open Library's main branch, and have successfully set up your local environment using docker. Now you're ready to understand how the code is structured within Open Library and what the lifecycle looks like of a visitor's request. 

## Approach

Working backwards from what you see on the site. In this guide, we're going to work backwards from what you see on the website and then explore the sequence of actions that result in this template being rendered and returned to a visitor when they navigate to a page on Open Library.

## Templates

In the majority of cases, when a visitor navigates to a page on Open Library, they will be served a "rendered" version of one of the html templates from the [`openlibrary/templates`](https://github.com/internetarchive/openlibrary/tree/master/openlibrary/templates) directory.

Here are a few examples of common templates:

* Homepage: [`home/index.html`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/home/index.html)
* Books Page(s): [`type/edition/view.html`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/type/edition/view.html) for both editions (e.g. https://openlibrary.org/books/OL30162974M) or works (https://openlibrary.org/works/OL257943W)
* Subjects Page(s): [`subjects.html`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/subjects.html) (e.g. openlibrary.org/subjects/climbing)
* Search: [`work_search.html`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/work_search.html) (e.g. openlibrary.org/search)
* Login & Register: [`login.html`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/login.html) and [`account/create.html`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/account/create.html)

## The Site Wrapper

You may notice that the pages within the templates folder don't include the `<html>` and `<head>` and `<footer>` sections of the website, only the contents of the body. Open Library is set up such that nearly all templates get included and wrapped by components in the  [`templates/site`](https://github.com/internetarchive/openlibrary/tree/master/openlibrary/templates/site) directory.

## Managing Large Templates

"Templatizing" templates. When a single template becomes too large and unmanageable, or when the programmer recognizes an opportunity to clean up a template by factoring-out common or shared pieces of logic, they may choose to break a template into smaller logical components and move them into their own separate micro-templates. These micro-templates can live beside other templates in the `templates/` directory. If these micro-templates are very self-contained and make sense to be rendered as their own widget, such the `QueryCarousel`, you might consider saving your template in the `macros` directory, which is folder of templates that have a few additional special properties.

## Macros

When refactoring  programmer may decide it makes sense to move the code to the `macros` directory. A `macro` is simply a special type of `template` that can be accessed using `{{}}` syntax by the page editor in Open Library.

## How Templates Work

TODO: This section explains how templates are rendered from python controllers and how variables can be passed from python-land to template-land...



