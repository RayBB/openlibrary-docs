i18n pages are infogami pages that can be translated by users. For example, https://openlibrary.org/subjects will redirect the user to https://openlibrary.org/subjects.en or https://openlibrary.org/subjects.es and so on depending on their locale.

### Converting a page to an i18n page

If a translator has translated and created a translation page (for example: `subjects.es`), here's how to convert the source page to an i18n page. As an example, I'm going to be using the page `https://openlibrary.org/librarians`. This flow requires administrator permissions.

1. Create the .en version of the page: https://openlibrary.org/librarians.en.yml?m=edit
    - Copy the contents of the un-suffixed page ( https://openlibrary.org/librarians.yml?m=edit ) over
    - update the `key` field to have the `.en` suffix
3. Edit the un-suffixed page (https://openlibrary.org/librarians.yml?m=edit)
    - remove its `body`
    - change its `type` to `/type/i18n_page`
4. Test:
    - https://openlibrary.org/librarians shows English (or whatever your locale is) text
    - https://openlibrary.org/librarians?lang=es Shows Spanish text