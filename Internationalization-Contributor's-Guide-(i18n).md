# i18n Contributor's Guide

I18n pages allow for the translation of content to various languages, enabling users to access localized versions of a webpage based on their locale preferences. For instance, when a user accesses https://openlibrary.org/subjects, they are redirected to https://openlibrary.org/subjects.en or https://openlibrary.org/subjects.es, depending on their selected language. Any text that is visible to the patron should be internationalized. The basics of web.py's `templator` I18N support is described here: http://webpy.org/cookbook/i18n_support_in_template_file

To get started:

1. Please kindly reach out to us via the volunteer page [https://openlibrary.org/volunteer#translator](https://openlibrary.org/volunteer#translator)
2. Watch this overview:

[![archive org_details_openlibrary-tour-2020_openlibrary-i18n mp4](https://user-images.githubusercontent.com/978325/122978288-33343700-d34b-11eb-858c-774151af4e87.png)](https://archive.org/embed/openlibrary-tour-2020/openlibrary-i18n.mp4?start=8)

Open Library i18n is handled via the [python Babel library](http://babel.pocoo.org/en/latest/), GNU `gettext`, and the message lists located https://github.com/internetarchive/openlibrary/tree/master/openlibrary/i18n

The messages file format used by the `gettext` toolset is described [here](http://pology.nedohodnik.net/doc/user/en_US/ch-poformat.html), and in the [gettext manual](https://www.gnu.org/software/gettext/manual/html_node/PO-Files.html#PO-Files).

In case you want to get started here are the following steps:

## Contributing translations

Option 1. [Locate the right target language within the project](https://github.com/internetarchive/openlibrary/tree/master/openlibrary/i18n) (e.g. `es` for Spanish) and then click on the `po` file (the raw file where translation strings are contributed), e.g. [this one for Spanish](https://github.com/internetarchive/openlibrary/tree/master/openlibrary/i18n/es). Click on the pencil (edit) option which will bring you to an [editable page like this](https://github.com/internetarchive/openlibrary/edit/master/openlibrary/i18n/es/messages.po) where you can add or edit translations. When you're satisfied with your translations, scroll down to the bottom of the page where it shows **Commit Changes**, leave a description of your changes and make sure to select the radio button of Create a **new branch**. You can call "translations-es" or dash whatever language you're working with. Then, click `Propose Changes` button and you're done! We can follow up if there are any validation issues which may need to be addressed.

Option 2. If you prefer working with `git` you may instead [fork / clone the repository from Github](https://github.com/internetarchive/openlibrary/fork). Install git and follow the instructions on our [Git Cheat Sheet](https://github.com/internetarchive/openlibrary/wiki/Git-Cheat-Sheet) to get set up.

## Adding a new language
If you are starting a new language translation, copy the template to the correct place in the directory hierarchy, add the plural forms info at the top and replace the English version of the `msgstr` text values with the translated versions for your language. A new directory containing a translation template file must be created for each new language.  These can be automatically generated if your Docker environment is set up (see our [Docker README](https://github.com/internetarchive/openlibrary/blob/master/docker/README.md)), or created manually.

Before creating the new directory, you will need to know your language's two-letter ISO 639-1 code.  Make a note of the code once you have found it here: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes

If you find something which can't be translated correctly (perhaps because the text is being concatenated in the code rather than in the message formatting), please create an issue describing the location and what the problem is.

### Adding a language in a Docker environment
1. Run `docker compose up -d`

2. Run `docker compose exec -uroot web ./scripts/i18n-messages add [CODE]`, replacing `[CODE]` with your two-letter ISO 639-1 code.

### Adding a language manually

1. **Create a new folder for your language.** Create a new folder in `/openlibrary/i18n/`, using your two-letter ISO 639-1 code as the folder's name.

2. **Make a copy of the latest messages to translate.** The messages template file, `/openlibrary/i18n/messages.pot` should be copied as `messages.po` (note the difference in extension, the `t` for template is dropped for the copy) to your newly created folder.

### Updating UI to include new language
In order for a new language option to be available in our language drop-down and footer, the [language_list.html](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/templates/languages/language_list.html) template must be updated to include the new language.  An Open Library staff member can do this if you are unfamiliar with HTML.

## Submitting translations
You can edit the `message.po` file using your favourite editor, or a .po specific tool such as [poedit](https://poedit.net/), and send in a Pull Request. Pull Request Guidelines can be found on our [CONTRIBUTING](https://github.com/internetarchive/openlibrary/blob/master/CONTRIBUTING.md) guide and our [Git Cheat Sheet](https://github.com/internetarchive/openlibrary/wiki/Git-Cheat-Sheet).

## Viewing and testing your changes
In order to open your language version of the website in the browser, you will need to setup your docker environment (see our [Docker README](https://github.com/internetarchive/openlibrary/blob/master/docker/README.md)). After having run `docker compose up -d`, run `docker compose run --rm -uroot home make i18n` to build the translation files; then e.g. http://localhost:8080/?lang=fr should work.
To view production Open Library in a preferred language, you will need to [adjust your browser language preferences]( https://www.w3.org/International/questions/qa-lang-priorities). You can also use the `lang=` parameter on the URL with a two character language code, e.g. https://openlibrary.org/?lang=fr

## Updating an existing language

If changes have been made to the `.pot` file, to reflect those changes to a given language you need to merge the two files. After setting up your docker environment (see our [Docker README](https://github.com/internetarchive/openlibrary/blob/master/docker/README.md), run the following, replacing `[CODE]` with your two-letter language code:

```bash
docker compose run --rm -uroot home ./scripts/i18n-messages update [CODE]
```

If you don't have a Docker set-up, you can also use [Poedit](https://poedit.net/) to merge PO and POT via 'Catalog -> Update from POT file' and use it to review and translate changed and missing strings.

See our [i18n guideline in the wiki](https://github.com/internetarchive/openlibrary/wiki/Frontend-Guide#internationalization-i18n---for-translators) for important and useful tips.

If you are updating an existing translation, run `scripts/i18n-messages update` to merge the new msgids from the `i18n/messages.pot` message templates into your `i18n/<lang>/messages.po` message catalog. Review all `fuzzy` matches and either remove the `fuzzy` keyword, if a correct match, or update and remove the `fuzzy` keyword. Make sure it's an exact match before removing the `fuzzy` label. Sometimes there are minor, but important changes like datatype changes, e.g. `%(count)s` to `%(count)d`. Also review all entries with an empty `msgstr` and add correct translations for them. 

If the text was revised and the update/matching algorithm didn't think it was a close enough match to even label a `fuzzy` match, you may find it at the bottom of the file in the section commented out with tildes (~). Any text in that section which is not useful to reuse or save, can be deleted.

Remember:
* keep the substitution variable names and data types unchanged in your translated text (e.g. `%(count)%s`)
* don't translate embedded HTML markup (e.g. <b>, <a href=>, etc)
* do escape any embedded quotes (e.g. `\"`)

## Validating your translations

Before submitting a PR with your translations, we recommend correcting any validation errors identified by the following script (replace `[CODE]` with your language code):

```bash
docker compose exec -uroot web ./scripts/i18n-messages validate [CODE]
```

## Extracting strings from HTML/python files (generating the `.pot` file)

To add i18n support to Open Library, templates and macros are modified to use gettext function calls. For brevity, the gettext function is abbreviated as:

```html
<a href="..">$_("More search options")</a>
```

The messages in the the templates and macros are extracted and `.pot` file is created. After setting up your docker environment (see our [Docker README](https://github.com/internetarchive/openlibrary/blob/master/docker/README.md), run:

```bash
docker compose run --rm -uroot home ./scripts/i18n-messages extract
```

The `.pot` file contains a `msgid` and a `msgstr` for each translation used. The `msgstr` field for each entry is filled with the translation of the required language and that file is placed at `openlibrary/i18n/$locale/messages.po`:

```bash
mkdir openlibrary/i18n/te
cp openlibrary/i18n/messages.pot openlibrary/i18n/te/messages.po
# edit openlibrary/i18n/te/messages.po and fill the translations
```

The `.po` files are compiled to `.mo` files to be able to use them by gettext system. This is done by `make i18n` automatically when the code is deployed, but needs to be done manually by a maintainer when deploying to dev.openlibrary.org .

## Glossary
- `.po` - Portable object file: This is the file where you will translators will add translations to.
- `.pot` - Portable object template file: This is the file that lists all the strings in Open Library _before_ translation.
- `.mo` - Machine object file: This file is generated by `make i18n`, and is what is used by the actual site.

## Deprecated messages that need updating to the new babel/gettext method:

The codebase has deprecated translations in the [/openlibrary/i18n](https://github.com/internetarchive/openlibrary/tree/master/openlibrary/i18n) directory. In directories of older translations, the `messages.po` file will be replaced with a `legacy-strings.{ISO 639-1 Code}.yml` file.

Languages with deprecated translations:

* hi Hindi
* kn Kannada
* mr Marathi
* nl Dutch

## Internationalizing Infogami Pages

@cdrini has a script to help automate the creation if i18n versions of openlibrary.org infogami pages (e.g. https://openlibrary.org/about v. https://openlibrary.org/about.es):

https://gist.github.com/cdrini/615d75653e1e47115930fa394e83ab17

# Internationalization (i18n) Developer's Guide

Any text that will be visible to the user should be internationalized. The basics of web.py's `templator` I18N support is described here: http://webpy.org/cookbook/i18n_support_in_template_file

The two primary i18n message functions are:
* `gettext()` which is bound to '_' as a convenience since it's commonly used 
* `ngettext()` (or `ungettext()` as we've historically used) which currently needs to be spelled out, but is commonly bound to `N_`, so that's a convention we may adopt.

Examples:

| Template | Description |
| --- | --- |
| `<a title="$_('Add this book to your Want to Read shelf')">$_('Want to Read')</a>` | **Simple string i18n**: ~80% of i18n falls into this category. (Note that the title is translated as well since it's visible to the user in hover text.) |
| `$_("Hi, %(user)s", user=username)!` | **Substitution**: For rendering variables inside the string. |
| `$ungettext("There is %(count)d person waiting for this book.", "There are %(count)d people waiting for this book.", wlsize, count=wlsize)` | **Singular/Plural text**: For when you want to render things like "1 person" vs. "2 people" or "1 edition" vs. "2 edition**s**". \* |
| `$:_('Licensed under <a href="https://...">CC0</a>. Yippee!')` | **HTML i18n**: For when you want to include links in text; you should try to avoid this where possible because it requires the translator to copy the HTML exactly—but sometimes you can't avoid it. Note you _should not_ split up the sentence; it might not make sense in other languages. (Note the `:` before the `_`! That's what makes it render raw HTML.)\*\* |

\* In the translation file, this would look like:

```po
#: borrow.html:114
#, python-format
msgid "There is %(count)d person waiting for this book."
msgid_plural "There are %(count)d people waiting for this book."
msgstr[0] "%(count)d personne attend ce livre."
msgstr[1] "%(count)d personnes attendent ce livre."
```
The top of the file declares the number of different plural forms for the language since this varies widely among languages. There is more information on plural forms support here: https://www.gnu.org/software/gettext/manual/html_node/Plural-forms.html

\*\* This sentence however _can_ be represented without i18n-ing the HTML by using python template strings:

```html
$def cc0_link():
  <a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" title="$_('This link to Creative Commons will open in a new window')">$_('CC0')</a>

$:(_('By saving a change to this wiki, you agree that your contribution is given freely to the world under %s. Yippee!') % str(cc0_link()).strip())
```
In this way, only the text is presented to the translators.

Must DOs:
* Internationalize all user visible strings, including HTML `title` and `alt` which are used 
* Use consistent terminology and phrasing throughout the UI to reduce the amount of text which needs to be translated
* Use meaningful mnemonic parameter names to help the translators understand the context. e.g. "%(editioncount)d editions"
* Double check that the format string types match the types of parameters being passed. Mismatches will cause errors at runtime.
* Be sure to escape embedded quotes and apostrophes, if necessary, after wrapping strings in single/double quotes. e.g. "_$('Mustn\'t forget to escape')"
* Be sure to remove extra dollar signs ($) when wrapping expressions with $_()
* Generate a message catalog template (messages.pot) when user visible strings are added or change
* Make changes incrementally in small batches. Multiple preprocessors (templator + babel) can make error messages obscure, so it's easier to debug if you know what changed.

DON'Ts:
* Don't display internal status / keyword values from the code directly to the user. These can't be internationalized.
* Don't do pluralization or string concatenation in code or templates. This mandates ordering in ways that can't be translated. Give the translators completed sentences or phrases, with embedded replacements, to work with so they can create natural translations.
* Don't use inline styling or links in text, if at all possible. e.g. <em>, <a href=foo>
* Don't update the translated message catalogs. Because the merging process is inexact, it's better for the translators to handle this so that they can validate the results. Do update the message templates though (ie `messages.pot`)
* Don't hard code in `1` for singular nouns (e.g. `1 edition`) because in some languages, `0 editions` is singular and translated as `0 edition`. Instead, substitute a variable, as you would with the plural. E.g. `$ungettext("There is %(count)d person waiting for this book.", "There are %(count)d people waiting for this book.", wlsize, count=wlsize)` and **not** `$ungettext("There is 1 person waiting for this book.", "There are %(count)d people waiting for this book.", wlsize, count=wlsize)`

## Using Localized Strings in Javascript Code

Unlike our Python code and HTML templates, there is currently no way to extract strings from our Javascript code for localization.  To bypass this limitation, we have been including localized strings in a `data-i18n` attribute.

As an example, the following code will display the localized `Hello World` message in the `.greeting-example` span when the `greeting.html` template is rendered on a page.

In the `greeting.html` template, we first create a `dict` that will contain all of the localized UI strings that will be used by the client-side code.  In this case, we only have a single string.
This `dict` is then added to the root element of the template in a `data-i18n` attribute.  The `json_encode` call simply converts a Python `dict` to a JSON string.

`/openlibrary/templates/greeting.html`:
```
$def with ()

$ i18n_strings = {
$   'greeting': _('Hello World')
$ }

<span class="greeting-example" data-i18n="$json_encode(i18n_strings)"></span>
```

In the main `index.js` file, we add code that initializes the `.greeting-example` element if it
exists on the page.

`js/index.js`:
```
const greetingElement = document.querySelector('.greeting-example')
if (greetingElement) {
    import('greeting')
        .then((module) => module.initGreeting(greetingElement))
}
```

In `initGreeting`, we parse the value of `data-i18n` and set the `textContent` of the greeting
span to the localized "Hello World" string.

`js/greeting.js`:
```
/**
 * Sets text content of the given element to the localized greeting.
 *
 * @param {HTMLElement} greetingElement
 */
export function initGreeting(greetingElement) {
    const i18nStrings = JSON.parse(greetingElement.dataset.i18n)
    greetingElement.textContent = i18nStrings.greeting
}
```


# Internationalization (i18n) Page Conversion Guide
Internationalization (i18n) pages are specialized pages within the Infogami platform that enable users to contribute translations. This guide outlines the process of converting a standard page into an i18n page, using the example of converting https://openlibrary.org/librarians to its English (`en`) i18n version.

Follow these steps to convert a standard page into an i18n page. In this example, we'll use https://openlibrary.org/librarians as the source page to be converted into its English (`en`) i18n version.

## Prerequisites

1.  Administrator permissions on the Infogami platform.

## Steps

1.  **Create the English (`en`) Version of the Page**
    -   Access the page: https://openlibrary.org/librarians.en.yml?m=edit
    -   Copy the content from the unsuffixed page: https://openlibrary.org/librarians.yml?m=edit
    -   Update the `key` field to include the `.en` suffix.
2.  **Edit the Un-Suffixed Page**
    -   Access the unsuffixed page: https://openlibrary.org/librarians.yml?m=edit
    -   Remove the existing `body` content.
    -   Change the `type` field to `/type/i18n_page`.
3.  **Test**
    -   Access https://openlibrary.org/librarians to ensure it displays content in English (or your desired locale).
    -   Access https://openlibrary.org/librarians?lang=es to verify that it displays content in Spanish (or the corresponding locale).

This concludes the process of converting a standard page into an i18n page, making it accessible in multiple languages. Ensure that you have made the necessary updates to the `key` and `type` fields as specified above.
