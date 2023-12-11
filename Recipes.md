## Magic incantation: Accessing `web.ctx`

Need to test Open Library functionality from the command line in python? You can use this magic incantation to load the minimal Open Library app to test models, use `web.ctx.site` to fetch data, and more.

First, you need to exec into the docker container and launch python:
`docker compose exec -it web python` 

Next, use the following incantation to load Open Library and launch a minimal headless app:
```
import web
import infogami
from openlibrary.config import load_config
# load_config('/olsystem/etc/openlibrary.yml') # if production
load_config('config/openlibrary.yml') # if local
infogami._setup()
from infogami import config
```

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

## Testing the affiliate API

```
import web
import infogami
from openlibrary.config import load_config
load_config('/olsystem/etc/openlibrary.yml')
infogami._setup()
from infogami import config
from openlibrary.core.vendors import AmazonAPI
web.amazon_api = AmazonAPI(*[config.amazon_api.get('key'), config.amazon_api.get('secret'),config.amazon_api.get('id')], throttling=0.9)
book = web.amazon_api.get_products(["1666568287"], serialize=True)
```

## Examine the affiliate queue
1. Log into the host `ol-home0`
2. `docker exec -it openlibrary-affiliate-server-1 bash`
3. `curl localhost:31337/status`

Or to monitor repeatedly during debugging:

% `cat > ~/affiliate_status.sh`
```
#!/bin/bash

while true
do
  curl --silent localhost:31337/status | cut -c 1-90
  sleep 1
done
```