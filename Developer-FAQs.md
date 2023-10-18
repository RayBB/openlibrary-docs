# FAQs: How do I...

## Import books that are missing from my local environment

You can use the https://github.com/internetarchive/openlibrary/wiki/Loading-Production-Book-Data guide to pull necessary book and author data from the production website's database.

## Get the logged in patron

```
from openlibrary import accounts
logged_in_user = accounts.get_current_user()
```

## Fetch a patron's S3 keys

```
from openlibrary import accounts
from openlibrary.accounts.model import OpenLibraryAccount

logged_in_user = accounts.get_current_user()
username = logged_in_user and logged_in_user.key.split('/')[-1]
account = username and OpenLibraryAccount.get(username=username)
s3_keys = web.ctx.site.store.get(account._key).get('s3_keys')
```

