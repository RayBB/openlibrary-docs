Contains design and implementation details of complex parts of the system. Mostly about specific pieces like lists (not overall)

* [Dev Instance](#dev-instance)
* [Lists](#lists)
* [Feature Flags](#feature-flags)

## Dev Instance

### Installing Dependencies

**Installing CouchDB**:

On Linux, installing CouchDB involves installing so many dependencies, some of them are incompatible with ubuntu/debian installations. Fortunately, a binary distribution with all the binaries is provided by [CouchOne](http://www.couchone.com/get)

The problem with that distribution is that it is interactive and it won’t be possible to automate the installation of that. To overcome this problem, the binaries after running the interactive installation are taken and bundled. The ol install script, downloads the bundle, unpacks it and runs a script to updates the path in some scripts and config files.

The created bundle couchdb-1.0.1-linux-binaries.tgz is uploaded to [this link](http://www.archive.org/details/ol_vendor).

On Max OS X, installing couchdb is somewhat easier than installing on Linux. However to make the installations on both mac and linux similar, binaries are taken from [CouchDBX app](http://dl.couchone.com/dl/26f246a0fe23d6a53d532671330bf06d/CouchDBX-1.0.1.1.zip).

Unlike Linux, where bin and etc are available in the top-level, Mac binaries have them at 2 level deep. To make both distributions identical, a bin/couchdb script is added and etc is symlinked from couchdb_1.0.1/etc. Also the Mac couchdb script expects the base directory should be the working directory. The above bin/couchdb script, takes of this too.


## Lists

Here we explain how the lists feature works.

## Feature Flags

Feature flags is a way to have features under development live on production and visible only to admins/beta-users.

The idea of Feature Flags came from Flicker. They manage their development on a single branch using feature flags. Here is a [link](http://code.flickr.com/blog/2009/12/02/flipping-out/)

### Using Feature Flags

Feature flags are used in templates and in controller classes. To make some part of the template visible only if a feature-flag is enabled:

```python
$if "lists" in ctx.features:
    <h3>Lists</h3>
    $for list in page.get_lists():
        ...
```

To enable a url only if a feature flag is enabled:

```python
class home(delegate.page):
    path = "/"

    def is_enabled(self):
        return "home-v2" in web.ctx.features

    def GET(self):
        return render_template("home")
```

### Setting Feature Flags

In Open Library, the feature flags are specified in the openlibrary.yml file as follows:

```yml
features:
    merge-authors: enabled
    lists: admin
    lending_v2:
        filter: usergroup
        usergroup: beta-users
```

The value of a feature flag is called a filter. A filter can be specified either as its name or as a dict containing its name and parameters. For example, the following 2 example mean the same.

```yml
features:
    lists: admin

features:
    lists:
        filter: admin
```

Available filters are:

* enabled
    Enabled for all users.

* disabled
    Disabled for all users.

* loggedin
    Enabled only for logged-in users.

* admin
    Enabled for admin users.

* usergroup
    Enabled for the users part of the specified usergroup.

```yml
lending_v2:
    filter: usergroup
    usergroup: beta-users
```

* queryparam
    Enabled only if the url has a specified query parameter.

```yml
debug:
    filter: queryparam
    name: debug
    value: true
```