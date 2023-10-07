Internationalization (i18n) pages are specialized pages within the Infogami platform that enable users to contribute translations. This guide outlines the process of converting a standard page into an i18n page, using the example of converting https://openlibrary.org/librarians to its English (`en`) i18n version.

Overview
--------

I18n pages allow for the translation of content to various languages, enabling users to access localized versions of a webpage based on their locale preferences. For instance, when a user accesses https://openlibrary.org/subjects , they are redirected to https://openlibrary.org/subjects.en or https://openlibrary.org/subjects.es, depending on their selected language.

Converting a Page to an I18n Page
---------------------------------

Follow these steps to convert a standard page into an i18n page. In this example, we'll use https://openlibrary.org/librarians as the source page to be converted into its English (`en`) i18n version.

### Prerequisites

1.  Administrator permissions on the Infogami platform.

### Steps

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