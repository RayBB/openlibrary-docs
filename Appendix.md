# Appendix

Welcome to Open Library Appendix documentation.

## Table of Contents

* [Configuration files](#configuration-files)
* [setup.py commands](#setup.py-commands)
* [Database Migrations](#database-migrations)
* [Dependencies](#dependencies)

## Configuration files

List of all the relevant config files, their syntaxes and what the control.

## setup.py commands

Most openlibrary operations are modeled as setup.py commands.

### bootstrap
Bootstraps the dev instance.

```
$ python setup.py bootstrap
```

Bootstrap command is explained in `bootstrap`.

### start

Starts all the OL services.:

```
$ python setup.py start
```

This command starts supervisord using configuration from `conf/supervisor/linux.ini` or `conf/supervisor/macosx.ini` based on the platform.

Logs of the services are written to var/log.

### shell

Start a bash shell with the env required for running all OL scripts.

```
$ python setup.py shell
```

This starts a bash shell with [conf/bashrc](http://github.com/internetarchive/openlibrary/blob/master/conf/bashrc) as rc file.

### test

Runs all the test cases.

```
$ python setup.py test
```

Behind the scenes it runs scripts/runtests.sh.

The custom setup.py commands are implemented in [setup_commands.py](http://github.com/internetarchive/openlibrary/tree/master/openlibary/core/setup_commands.py).

To know more about how to add custom setuptools commands, see [this link](http://tarekziade.wordpress.com/2007/09/30/extending-set).

## Database Migrations

Occasionally, new tables get added to Open Library database and some existing tables get altered. Scripts are provided to migrate the existing dev instances to new schema.

To migrate an existing dev instance:

```
$ python setup.py shell
$ python scripts/migrate_db.py
```

This will look the current database schema and identifies its version and upgrades it to the latest version.

