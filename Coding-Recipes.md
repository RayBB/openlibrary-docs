* [Setup](#The-Magic-Incantation)

# The Magic Incantation

Any time you want to import and test open library code that needs access to web.ctx, you'll need to run a magic incantation 🧙.

First, you need to exec into the docker container and launch python:
`docker compose exec -it web python` 

Next, use the following incantation to load Open Library and launch a minimal headless app:

```py
import web
import infogami
import os
from openlibrary.config import load_config
path = '/olsystem/etc/openlibrary.yml'  # prod
if not os.path.exists('/olsystem/etc/openlibrary.yml'):
  path = 'config/openlibrary.yml'  # fallback to dev
load_config(path)
infogami._setup()
from infogami import config
```

# Fetching a patron's S3 keys

Most privileges actions/requests Open Library takes on behalf of a patron will require their s3 keys:

```py
from openlibrary import accounts
from openlibrary.accounts.model import OpenLibraryAccount

logged_in_user = accounts.get_current_user()
username = logged_in_user and logged_in_user.key.split('/')[-1]
account = username and OpenLibraryAccount.get(username=username)
s3_keys = web.ctx.site.store.get(account._key).get('s3_keys')

# Fetching Privacy Settings

How to determine, given a set of patron usernames, which have public reading logs / can be followed?

```
usernames = ['mekBot', 'ScarTissue', 'seabelis', 'brewster', 'jachamp']
user_prefs = web.ctx.site.get_many([f'/people/{username}/preferences' for username in usernames])
followable = dict((user.key.split('/')[2], user.notifications.public_readlog == 'yes') for user in user_prefs)
```