# Running Tests, Writing Testing, & Continuous Integration

XXX This page needs updating 

## Running Automated Tests
From the root of your local openlibrary project, you can run the JavaScript and Python unit tests in a Docker container with the following command:

    docker compose run --rm home make test

To run the pytests in one or more files, you can use:

    docker compose run --rm home pytest openlibrary/plugins/importapi/tests/test_import_validator.py

General Docker instructions are to be found in the repo at https://github.com/internetarchive/openlibrary/tree/master/docker and repo testing instructions are in the main README: https://github.com/internetarchive/openlibrary/blob/master/Readme.md#running-tests

To run the same tests on the shared development server, `ol-dev0` (requires ssh access), make sure you activate venv:

```
ssh -A ol-dev0
source /opt/openlibrary/venv/bin/activate 
cd /opt/openlibrary/openlibrary
sudo make test
```

## Linting
The Continuous Integration (CI) server will [lint](https://en.wikipedia.org/wiki/Lint_(software)) (i.e. statically analyze code for bugs and stylistic bugs) the code in each Pull Request (PR) and attempt to fix any errors it finds. However, for errors that require human intervention, you may see something similar to the following:

![image](https://github.com/internetarchive/openlibrary/assets/26524678/20fec6e1-20eb-4a40-9744-83762e25777a)

Although you can simply look at the details, change your code and resubmit to see if everything passes, you can also pre-lint Python and JavaScript files locally to avoid repeated re-submits to the CI server.

### Lint JavaScript in Docker
To lint only JS, one can run:
- `docker compose run --rm home npm run lint`.

### Lint everything with `pre-commit` from your shell outside of Docker
To lint everything the CI server checks (JavaScript, `mypy`, `black`, `ruff`, etc.), and to do so automatically at the time of commit, one can run, in the local environment, outside of Docker, a Python program named `pre-commit`. This will use `git`'s [hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) to run Open Library-specific linting checks when committing code in `git`. Because `pre-commit` integrates with `git`, that means it runs outside of Docker, and needs to be available to `git` in your current environment.

Prerequisites:
- the version of your current Python interpreter must match the version of Python specified in the `default_language_version` section of [`.pre-commit-config.yaml`](https://github.com/internetarchive/openlibrary/blob/master/.pre-commit-config.yaml).

Although a complete discussion of managing Python's versions and Python's virtual environments is outside the scope of this discussion, it is likely worth creating a virtual environment for each Python project on which you work. See Python's own documentation about [`venv`](https://docs.python.org/3/library/venv.html) for one such approach to managing virtual environments. Additionally, if your `python3 --version` doesn't match the version specified in `.pre-commit-config.yaml`, consider [`pyenv`](https://github.com/pyenv/pyenv) on Linux, macOS, or Windows Subsystem for Linux, or [`pyenv-win`](https://github.com/pyenv-win/pyenv-win) on Windows outside of the Windows Subsystem for Linux.

*Note:* this will install a `git` commit hook that will run prior to every commit. As there are times where one may simply wish to commit code, even if it will fail the linting, **one can override commit hooks with `git commit --no-verify`**. For more on `pre-commit`, see https://pre-commit.com/.

To enable `pre-commit`, run the following in your local shell outside of Docker:
1. `pip install pre-commit` or `brew install pre-commit`; and
2. `pre-commit install`

Henceforth, `pre-commit` will lint your code with every `git commit` (unless you commit with `git commit --no-verify` to disable running the hooks). To manually run `pre-commit`, you can execute `pre-commit run --all-files`.

If you see an error similar to either of the following, please ensure you the version of you Python interpreter matches the version specified in `.pre-commit-config.yaml`:
```
An unexpected error has occurred: CalledProcessError: command: ('/home/scott/.pyenv/versions/3.9/bin/python3.9', '-mvirtualenv', '/home/scott/.cache/pre-commit/repolh5wc3hy/py_env-python3.11', '-p', 'python3.11')
return code: 1
stdout:
    RuntimeError: failed to find interpreter for Builtin discover of python_spec='python3.11'
stderr: (none)
Check the log at /home/scott/.cache/pre-commit/pre-commit.log
```

To remove `pre-commit`, run `pre-commit uninstall`.

# Testing Critical Paths

## Main Components / Actions

- Auth (registration, signup)
- Lending (Borrow, Return, Join/Leave Waitlist)
- Searching (all, title, author, advanced, subject)
- Navigation (header, footer)
- Accounts (Settings)
- Books (editions/works pages, share links, etc)
- Carousels (subject, IA-query-based)
- Reading Log (setting status, changing set status, removing status)
- Lists (add, remove, create, delete)
- Edits? (add fake book, history, merges?)
- Import
- Stats

### Auth

- User can register for an account
- User can login to IA and OL with Archive.org credentials

### Lending

- User can read a public domain book
- User can borrow an inlibrary book
- User can read a borrowed inlibrary book
- User can return a borrowed inlibrary book
- User can join waitlist
- User can leave waitlist

### Searching

- Search by "All"
- Search by "Title"
- Search by "Author"
- Search by "Subject"
- Search by "Advanced" (form)
- Switch modes: Everything, Ebooks-only, Print-disabled
- Test facets

### Navigation

- Test dropdowns
- Click each link and verify the destination pages match expectations

### Reading Log

*On Book/Works Pages*

- From clean slate, mark as "Want to Read", "Currently Reading", "Already Read"
- From "Want to Read", "Currently Reading", "Already Read"; change state
- From "Want to Read", "Currently Reading", "Already Read"; remove state

# Troubleshooting

**Question:** GitHub Actions CI build fails due to JavaScript linting errors?

**Answer:** This can be solved by running `npm run lint:fix` inside the docker container.

**Issue link:** For a full description see: https://github.com/internetarchive/openlibrary/issues/1868

***

**Question:** What should I do if I come across a bundle-size error (like the one below) while running `docker compose run --rm home make test` to test? 
```
 FAIL static/build/page-plain.css: 18.81KB > maxSize 18.8KB (gzip)
```
**Answer:** Unless the extra CSS content is well justified, consider placing styles in an JavaScript entry point file e.g. `<file_name>--js.less` and load it inside `static/css/js-all.less` via `@import`. This CSS will only get loaded via JavaScript and has a much higher bundle size threshold, otherwise, bundle-sizes can be changed in `openlibrary/package.json`.

**Issue Link**: https://github.com/internetarchive/openlibrary/wiki/Frontend-Guide#beware-of-bundle-sizes