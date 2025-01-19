## What is Cache?

Cache is a way of taking expensive values we've computed and storing them in resident memory for a period of time. A good example is "top books this week" -- such a query likely won't change much if we re-run it multiple times a second, whereas doing so may have a significant (even untenable) consequence on CPU or the database. Therefore, we `cache` the computed value for some period of time (e.g. 1 hour).

## Minimal Reference Example

```
from openlibrary.core import cache

def fibonacci(n):
    return (
        fibonacci(n - 1) + fibonacci(n - 2)
        if n >= 1 
        else (1 if n > 0 else 0)
    )

cached_fibonacci = cache.memcache_memoize(fibonacci, key_prefix='fib', timeout=60*5)
```

## How Cache Lifecycle Works

When a function is cached and run for the first time, there is no value to retrieve from cache to return to the waiting patron, and so the lookup will fail. Therefore, since the patron is waiting on the value, it is computed on the main thread of the web application and saved in cache. The next time the cached version of the function is called, the value will be looked up in cache and returned to the patron **unless** the timeout expiration period has been reached, in which case the **stale** value from cache will be returned to the patron and the function will, in the background, be asynchronously re-run **on a memcache thread**. This way we can avoid a patron having to wait and be blocked on an expensive function being run.

## Caching web.ctx

Because of how memcache asynchronously recomputes functions on worker threads, outside the context of the main application, two important considerations follow:

1. Privacy: Every patron's request will have different `web.ctx` objects with information unique and sensitive to their specific request(s) and so we want to be very careful not to cache these objects and leak their private information to other patrons.
2. Limited Access: Many request or application-specific objects, like the `web.ctx` object, are necessary for accessing things like the database but are not available from the context of memcached threads.

In [some cases](https://github.com/internetarchive/openlibrary/issues/10318#issuecomment-2598903078), the function you're caching will need access to the `web.ctx` object. To achieve this safely, your cached function should use `delegate.fakeload()` which will hydrate a minimal, `web.ctx` object that can be safely used within the context of the cached function. In the following example, our cached function presumably calls a function that needs access to the `lang` property of the `web.ctx` object. Since `web.ctx` is not available in/from the memcache worker thread, we can use `delegate.fakeload()` to initiate a safe `web.ctx` object and then we can inject our desired `lang` value into the hydrated object.


```
def my_cachable_function(web_ctx_lang):
if 'env' not in web.ctx:
    delegate.fakeload()
    web.ctx.lang = web_ctx_lang
```


## Walkthrough

Let's assume you have an expensive function like fibonacci:
```
def fibonacci(n):
    return (
        fibonacci(n - 1) + fibonacci(n - 2)
        if n >= 1 
        else (1 if n > 0 else 0)
    )
        
``` 
The `openlibrary.core.cache.memcache_memoize` method is used as a decorator to return a cache-enabled version of `fibonacci` (we'll call `cached_fibonacci`) which, when called, first checks whether a recent enough, precomputed value exists in cache for the given input arguments before proceeding to call `fibonacci`. For instance, if we call `cached_fibonacci(4)`, `memcache_memoize` will look in cache's memory for a record corresponding to the function `fibonacci` with corresponding argument `4` to see if a corresponding pre-computed value exists and if so, will return it. If no such value exists or the value in cache is too old, `fibonacci` will then be called and the corresponding value will be inserted or updated within cache under the function `fibonacci` and the argument `4` with an updated timestamp to be used/evaluated by the next lookup.

In reality, the parameter `key_prefix` to `memcache_memoize` (and not the function's name) is used in conjunction with the input parameters to the cached function in order to computer the cache key. For instance, a real example may look like this:

```
cached_fibonacci = cache.memcache_memoize(fibonacci, key_prefix='fib', timeout=60*5)
```

This call to `memcache_memoize` returns a cache-enabled version of `fibonacci` that will cache each computed value for 5 minutes using the key `fib` in union with whatever `args` and `kwargs` get passed into `fibonacci`. In practice, for our example, we might expect the cache `key` of `cached_fibonacci` to look like `fib-4`.

## Reference Code

See [generic_carousel](https://github.com/internetarchive/openlibrary/blob/3bad3325e1392102db485dea34db67a186af2dcf/openlibrary/plugins/openlibrary/home.py#L181-L208)'s use of `cache.memcache_memoize` in `plugins/openlibrary/home.py` to cache the any result computed by `get_ia_carousel_books` function for 2 minutes.

## How to test cache

First, go into the `web` docker container where you have access to python and openlibrary:

`docker compose exec web python`

```
import time
import web
import infogami
from openlibrary.config import load_config
load_config('conf/openlibrary.yml') # for local dev
# load_config('/olsystem/etc/openlibrary.yml') # for prod
infogami._setup()
from infogami import config
from openlibrary.core import cache

def my_function(arg1, arg2, kwarg1="a", "kwarg2="b"):
    return (arg1, arg2, kwarg1, kwarg2)

# Create a cached version of `my_function`
my_cached_function = cache.memcache_memoize(my_function, key_prefix='myfunc', timeout=60*5)

# An example call:
# Calling `my_cached_function` will first check cache to see if a pre-computed value already exists.
# It does so by first computing a key based on the `key_prefix`  a 

 to the cache that looks something like "myfunc-arg1-arg2-kwarg1-kwarg2"
# and save its value as well as the timestamp for when it was computed.
# The next time we call it, the cache system will check the time to see whether to return
# the cached value or whether to call `my_function` again and update the value in cache.
my_cached_function('arg1', 'arg2', a=2, b=3)

# Sometimes we may manually want to overwrite a function's cached value for a key:
# memcache_set takes a list of args and kwargs (i.e. the inputs for `my_function`) and uses them to create
# a cache key like "myfunc-arg1-arg2-kwarg1-kwarg2" which is what we use to fetch the function's pre-computed
# value from cache.
my_cached_function.memcache_set(['arg1', 'arg2'], {'a': 2, 'b': 3}, 'THIS IS MY NEW VALUE', time.time())

# Similarly, we can update it 
my_cached_function.memcache_get(['arg1', 'arg2'], {'a': 2, 'b': 3})
```