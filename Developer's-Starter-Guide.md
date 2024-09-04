## Audience
The intended audience of this guide are **first time contributors** who are trying to understand the Open Library codebase.

## Prerequisites
Before starting this guide, it is recommended that you have:

1. [cloned](https://github.com/internetarchive/openlibrary.git) or [forked](https://github.com/internetarchive/openlibrary/fork) and pulled an up-to-date version of the Open Library repository
2. successfully launched your local environment using the [docker guide](https://github.com/internetarchive/openlibrary/tree/master/docker#readme)
3. completed the [git cheat sheet](https://github.com/internetarchive/openlibrary/wiki/Git-Cheat-Sheet) tutorial
4. found a [good first issue](https://github.com/internetarchive/openlibrary/issues?q=is%3Aissue+is%3Aopen+-linked%3Apr+label%3A%22Good+First+Issue%22+no%3Aassignee) to work on

Now you're ready to understand how the code is structured within Open Library.

## Approach

Working backwards from what you see on the site. In this guide, we're going to work backwards from what visitors see on the Open Library website and then explore the sequence of actions (the "lifecycle") that takes place in order for the html to be served.

## The Anatomy of the Site

### HTML Templates

When a patron navigates through the Open Library website and requests pages, like the one pictured below, they will be served "rendered" html content from the [`openlibrary/templates`](https://github.com/internetarchive/openlibrary/tree/master/openlibrary/templates) directory.

<img width="500" alt="Screenshot 2024-09-04 at 6 12 47 AM" src="https://github.com/user-attachments/assets/8f8de2d6-e255-492d-8552-3e11b69c50fc">

Here are a few examples of common templates:

* Homepage: [`home/index.html`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/home/index.html), which gets rendered [here](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/openlibrary/home.py#L52)
* Books Page(s): [`type/edition/view.html`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/type/edition/view.html) for both editions (e.g. https://openlibrary.org/books/OL30162974M) or works (https://openlibrary.org/works/OL257943W),
* Subjects Page(s): [`subjects.html`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/subjects.html) (e.g. openlibrary.org/subjects/climbing)
* Search: [`work_search.html`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/work_search.html) (e.g. openlibrary.org/search)
* Login & Register: [`login.html`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/login.html) and [`account/create.html`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/account/create.html)

> [!NOTE]  
> You may notice that most the html pages within the templates folder don't include the `<html>`, `<head>`, and `<footer>` sections of the website, just the contents of the body. This is because Open Library is set up such that nearly all `page` templates get automatically wrapped by the [`site`](https://github.com/internetarchive/openlibrary/tree/master/openlibrary/templates/site.html) template.

### The Site Wrapper

While the body of each Open Library page may present differently, most pages share similar scaffolding, look, and feel. For instance, nearly every page will have:

<a id="site-subtemplate-examples"></a>
1. A top black bar [`topNotice`](openlibrary/templates/site/alert.html) with an Internet Archive logo:<br><img width="500" alt="Screenshot 2024-09-04 at 6 26 30 AM" src="https://github.com/user-attachments/assets/395c2406-b297-4b9d-bb02-6aee85cc6fb2">
2. A header [`header#header-bar`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/lib/nav_head.html) section with the Open Library logo, a search box, a hamburger menu, and an account dropper for logged in patrons:<br><img width="500" alt="Screenshot 2024-09-04 at 6 27 23 AM" src="https://github.com/user-attachments/assets/a3c9380e-83f8-49e4-8681-8f7379843fc4">
3. A [`footer`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/lib/nav_foot.html) menu:<br><img width="500" alt="Screenshot 2024-09-04 at 6 27 53 AM" src="https://github.com/user-attachments/assets/c5748e17-ae40-4cc7-97ab-5c6230cc12ec">

The top-level html page that is used to define and render the overall structure of every Open Library page is [`templates/site.html`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/site.html). In its definition, this main `site` template calls out to other modular, specific "sub-templates" (such as the [3 described above](site-subtemplate-examples)) defined within the `templates/site` and `templates/lib` directories, which combine to form the "site".

The variable section of the `site` that changes depending on the requested `page` is the [`body`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/site/body.html#L39). This `page` is an html template that gets passed in to the `site`. You may wish to review examples in the [Page Templates](#Page_Templates) section.

### How a Page Gets Rendered

When we want to serve a rendered template to a visitor, we typically use the [`render_template()`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/plugins/openlibrary/home.py#L52) function. The first argument of `render_template` will be be the name of the page-specific html template we want to be rendered and injected into the `site` body. The rest of the parameters to `render_template`, after the filename of the template, are used to pass variables from python into the corresponding html template file, as defined in the template's header.

For instance, imagine we have a simple template called `templates/book.html` which requires a `book_title`, a `bookcover_url`, and an `author_name`. Such a template might look like:

```
$def with (book_title, bookcover_url, author=None)

<div>
  <h1>$book_title</h1>
  <img src="$bookcover_url"/>
  $if author:
    <h2>$author</h2>
</div>
```

The `$def with(...)` line is how the template declares what variables it needs to be passed in when it is being called and rendered. Elsewhere in the template, the `$` symbol acts as an instruction that a variable should be replaced by its value when it's being rendered.

> [!CAUTION]
> The `$:` combination instructs the template to render this variable as html, as opposed to plaintext. This is sometimes necessary when rendering one html template from another, but should be done with care when rendering a variable whose value may be user-specified because this may result in dangerous [XSS attacks](https://en.wikipedia.org/wiki/Cross-site_scripting), where a bad actor may intentionally save javascript code into a variable, hoping that the website will render and execute this code as html as opposed to safe plaintext. 

> [!NOTE]  
> Notice that `author` in this example is provided as a keyword argument with a default value of `None` and thus is optional when the template is being called. Similar to when defining a python function, once a keyword argument is defined, all following variables after it must also then be keyword arguments.

From python, the corresponding code to render this `templates/books.html` template would be:

```
render_template('books', book_title="The Hobbit", bookcover_url="https://covers.openlibrary.org/b/id/14624642-L.jpg", author="J.R.R. Tolkien")
```

> [!TIP]  
> When we call `render_template`, it knows to look in the `templates/` directory and so we don't need to specify this. Also, we don't need to include the `.html` extension.

When we call `render_template('book', ...)` we are fetching the `templates/book.html` template and passing in the values `book_title`, `bookcover_url`, and `author` from python into the template's `$def with (...)` section, where it can be substituted as needed into the `$variables` in the template. The `render_template` takes this prepared `book` template and then passes it into `site.html` where it will be forwarded to the [`body`](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/site/body.html#L39) to be rendered. 

## Managing Large Templates

When a single template becomes too large and unmanageable, or when the programmer recognizes an opportunity to clean up a template by factoring-out common or shared pieces of logic, they may choose to break a template into smaller logical components and move them into their own separate micro-templates. These micro-templates can live beside other templates in the `templates/` directory. If these micro-templates are very self-contained and make sense to be rendered as their own widget, such the `QueryCarousel`, you might consider saving your template in the `macros` directory, which is folder of templates that have a few additional special properties.

## Macros

When refactoring  programmer may decide it makes sense to move the code to the `macros` directory. A `macro` is simply a special type of `template` that can be accessed using `{{}}` syntax by the page editor in Open Library.

Here's what the infogami edit UI looks like for a collection:
<img width="610" alt="Screenshot 2024-09-04 at 8 31 02 AM" src="https://github.com/user-attachments/assets/a74e9582-5cc4-456b-bcdd-b5fcde5f50c7">

Here's what the page looks like when it's rendered with a macro:
<img width="624" alt="Screenshot 2024-09-04 at 8 31 28 AM" src="https://github.com/user-attachments/assets/1b72db4e-8258-40f4-aa8c-206ffc82d5bc">

## Understanding controllers & routers

So far, by extrapolating from what's written in this guide, we hope you've learned how you may be able to:
1. Find the corresponding html template file for an Open Library webpage somewhere in the `templates/` directory
2. How to make a change to the site wrapper, should you need to e.g. change the header or footer
2. In theory, add a new template and render it... But from where?

The next step is learning where to add our `render_template(...)` code and how to connect a url that a patron visits with logic to respond to this request.

To answer this question, you'll want to proceed to the [Plugins Guide](https://github.com/internetarchive/openlibrary/tree/master/openlibrary/plugins#readme).