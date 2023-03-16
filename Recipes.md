## Testing the affiliate API

```
import web; import infogami; from openlibrary.config import load_config; load_config('/olsystem/etc/openlibrary.yml');infogami._setup();from infogami import config;from openlibrary.core.vendors import AmazonAPI;web.amazon_api = AmazonAPI(*[config.amazon_api.get('key'), config.amazon_api.get('secret'),config.amazon_api.get('id')], throttling=0.9);book = web.amazon_api.get_products(["1666568287"], serialize=True)
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