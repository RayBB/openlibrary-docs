# Running Tests, Writing Testing, & Continuous Integration

XXX This page needs updating 

## Running Automated Tests
From the root of your local openlibrary project, you can run the JavaScript and Python unit tests in a Docker container with the following command:

    docker compose run web make test

To run the pytests in one or more files, you can use:

    docker compose run web pytest openlibrary/plugins/importapi/tests/test_import_validator.py

General Docker instructions are to be found in the repo at https://github.com/internetarchive/openlibrary/tree/master/docker and repo testing instructions are in the main README: https://github.com/internetarchive/openlibrary/blob/master/Readme.md#running-tests

To run the same tests on the shared development server, `ol-dev0` (requires ssh access), make sure you activate venv:

```
ssh -A ol-dev0
source /opt/openlibrary/venv/bin/activate 
cd /opt/openlibrary/openlibrary
sudo make test
```

## Linting
The CI server will lint JavaScript and Python, but one can pre-lint files locally to avoid repeated re-submits to the CI server. To lint only JS, one can run:
- `docker compose exec web npm run lint`.

To lint everything the CI server checks (JavaScript, `mypy`, running `black`, `ruff`, etc., and do so automatically at the time of commit, one can use `pre-commit`.

*Note:* this will install a `git` commit hook that will run prior to every commit. As there are times where one may simply wish to commit code, even if it will fail the linting, **one can override commit hooks with `git commit -n`**. For more on `pre-commit`, see https://pre-commit.com/.

To enable `pre-commit`:
1. `pip install pre-commit` or `brew install pre-commit`; and
2. `pre-commit install`

Henceforth, `pre-commit` will lint your code with every commit (unless you commit with `git commit -n` to disable running the hooks). To manually run `pre-commit`, you can execute `pre-commit run --all-files`.

To remove `pre-commit`, run `pre-commit uninstall`.

# Integration Tests

Integration tests use the Splinter webdriver with Google Chrome. For instructions on installation requirements and running integration tests, [see Integration Tests README](/internetarchive/openlibrary/blob/master/tests/integration/README.md). Integration tests are **not** run automatically and they require a non-headless machine (i.e. a web browser is currently required). You can do this on your local machine (not in Docker) within your tmp directory:

```
cd /tmp
virtualenv venv
source venv/bin/activate
git clone git@github.com:internetarchive/openlibrary.git
cd openlibrary/
pip install -r requirements.txt
cd tests/integration
./tmp/venv/bin/pytest
```

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

**Question:** What should I do if I come across a bundle-size error (like the one below) while running `docker compose exec web make test` to test? 
```
 FAIL static/build/page-plain.css: 18.81KB > maxSize 18.8KB (gzip)
```
**Answer:** Unless the extra CSS content is well justified, consider placing styles in an JavaScript entry point file e.g. `<file_name>--js.less` and load it inside `static/css/js-all.less` via `@import`. This CSS will only get loaded via JavaScript and has a much higher bundle size threshold, otherwise, bundle-sizes can be changed in `openlibrary/package.json`.

**Issue Link**: https://github.com/internetarchive/openlibrary/wiki/Frontend-Guide#beware-of-bundle-sizes