Cache is a way of taking expensive values we've computed and storing them in resident memory for a period of time. A good example is "top books this week" -- such a query likely won't change much if we re-run it multiple times a second, whereas doing so may have a significant (even untenable) consequence on CPU or the database. Therefore, we `cache` the computed value for some period of time (e.g. 1 hour).

## How to cache

## How to test cache

```
import time
import web
import infogami
from openlibrary.config import load_config
load_config('conf/openlibrary.yml') # for local dev
# load_config('/olsystem/etc/openlibrary.yml') # for prod
infogami._setup()
from infogami import config;
from openlibrary.core import cache

def my_function(arg1, arg2, kwarg1="a", "kwarg2="b"):
    return (arg1, arg2, kwarg1, kwarg2)

# Create a cached version of `my_function`. When we call my_cached_function(...)
# it will add a value to the cache that looks something like "myfunc-arg1-arg2-kwarg1-kwarg2"
# and save its value as well as the timestamp for when it was computed.
# The next time we call it, the cache system will check the time to see whether to return
# the cached value or whether to call `my_function` again and update the value in cache.
my_cached_function = cache.memcache_memoize(my_function, key_prefix='myfunc', timeout=60*5)

# An example call:
my_cached_function('arg1', 'arg2', a=2, b=3)

# Sometimes we may manually want to overwrite a function's cached value for a key:
# memcache_set takes a list of args and kwargs (i.e. the inputs for `my_function`) and uses them to create
# a cache key like "myfunc-arg1-arg2-kwarg1-kwarg2" which is what we use to fetch the function's pre-computed
# value from cache.
my_cached_function.memcache_set(['arg1', 'arg2'], {'a': 2, 'b': 3}, 'THIS IS MY NEW VALUE', time.time())


# Similarly, we can update it 
my_cached_function.memcache_get(['arg1', 'arg2'], {'a': 2, 'b': 3})
```