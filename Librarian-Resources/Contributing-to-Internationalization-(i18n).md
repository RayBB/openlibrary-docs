Want to get started contributing a language towards Open Library internationalization (i18n)?

Kindly take a look at this [Issue thread](https://github.com/internetarchive/openlibrary/issues/871) for more information.

## About

Open Library i18n is handled via the [python Babel library](http://babel.pocoo.org/en/latest/), GNU `gettext`, and the message lists located https://github.com/internetarchive/openlibrary/tree/master/openlibrary/i18n

More details can be found [here](https://github.com/internetarchive/openlibrary/blob/master/openlibrary/i18n/__init__.py)

The messages file format used by the `gettext` toolset is described [here](http://pology.nedohodnik.net/doc/user/en_US/ch-poformat.html), and in the [gettext manual](https://www.gnu.org/software/gettext/manual/html_node/PO-Files.html#PO-Files).


The codebase has now deprecated code and strings located here: https://github.com/internetarchive/openlibrary/tree/master/openlibrary/plugins/openlibrary/i18n

There are a small number of messages in the following languages:

* es Spanish
* hi Hindi
* it Italian
* kn Kannada
* mr Marathi

In case you want to get started here are the following steps:

## Step 1: Clone the Repository from Github
Install git and run the following command on the command line:
```
git clone https://github.com/internetarchive/openlibrary/
cd openlibrary/
```

## Step 2: Create a new folder for your language
At the end of this document is a detailed table of languages and their code. Create a new folder in `/openlibrary/i18n/` with the code name of the language that you wish to translate to.

## Step 3: Make a copy of the latest messages to translate
The messages template file, `/openlibrary/i18n/messages.pot` should be copied as `messages.po` (note the difference in extension, the `t` for template is dropped for the copy) to your newly created folder.

## Step 4: Make the translations and send a PR
You can edit the `message.po` file using your favourite editor, or a .po specific tool such as [poedit](https://poedit.net/) and send in a Pull Request. Pull Request Guidelines can be found on our [README](https://github.com/internetarchive/openlibrary/blob/master/Readme.md) and [CONTRIBUTING](https://github.com/internetarchive/openlibrary/blob/master/CONTRIBUTING.md) guide.