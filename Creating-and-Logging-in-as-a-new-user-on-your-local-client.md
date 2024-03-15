# Creating and Logging into New Users

Typically, logging into the Open Library entails cross-authenticating with an Internet Archive account. This isn't an option on the local-host, so a few work-arounds are needed to properly reproduce certain bugs. 

However, all is not lost! By delving into the python shell within your web container, we can directly add users through infogami, bypassing the typical process account creation process. 

## Step 1: Loading up Infogami 
First, we have to execute the Python REPL within the `web` container in Docker; one way to accomplish this is `docker compose web exec python`.

From here, we have to load up Infogami, and get it started. 
```
import web
import infogami
from openlibrary.config import load_config
load_config('conf/openlibrary.yml') # for local dev
# load_config('/olsystem/etc/openlibrary.yml') # for prod
infogami._setup()
from infogami import config
from infogami.infobase import server
```

These commands get the necessary portions of infogami and the open library running.  (Tip: While ctrl + V does not function to paste sections of code into the python command-line, right clicking will paste whatever's stored in your clipboard. If you're on Mac, or otherwise don't have right functionality, you might have to manually enter the code. Shift+Insert will also paste on some configurations.)

To test that this is working as intended, type `web.ctx.site` into the REPL. If it doesn't show up, something has gone wrong. 
```
>>> web.ctx.site
<infogami.infobase.client.Site object at 0x7506c00c84d0>
```

## Step 2: Creating and Activating the Account

Next, we run the account creation process through the connection in `web.ctx.site`. (If you want to look further into what's being done, the relevant class is located in `Infogami.infobase.client.py`.)

```
>>> web.ctx.site.register('test_username', 'test_displayname', 'test@example.com', 'test_password')
0.0 (5): SELECT * FROM store WHERE key='account/test_username'
0.03 (2): 200 POST /openlibrary.org/account/register {'username': 'test_username', 'displayname': 'test_displayname', 'email': 'test@example.com', 'password': 'test_password'}
<Storage {'activation_code': None, 'email': 'test@example.com'}>
```

Keep in mind the email that you use here; it'll be necessary for logging in. 

Next, we have to initialize the site on the server's end, to be able to properly activate the account.
 
```
site = server.get_site('openlibrary.org')
site.account_manager.activate(<username>)
```

At this point, the account should be activated. However, we're not quite finished. In order to login, we have to edit how the program spoofs the information that would normally be returned by the internet archive. 

## Step 3: Logging in
In `openlibrary.plugins.upstream.account.py`, there should be a class called `xauth`. 

![image](https://github.com/internetarchive/openlibrary/assets/131627264/439fe897-1a09-4914-b2fd-59f5ab9fd95f)

In order to log-in to an account,  result['itemname'] on line 121 (on this image), must be set to the account's username that you are trying to log into.

Once this is set, you should be able to log into that account with the same email on your typical log-in screen. Remember; in order to access your admin account again, you'll have to change the item name back to `@openlibrary`.