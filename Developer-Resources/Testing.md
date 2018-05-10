# Automated Tests

From the root of the openlibrary project, make sure you're either in ol-dev0 venv or in vagrant. Assuming the feature is staged on dev (skip ssh and venv if in vagrant):

```
ssh -A ol-dev0
source /opt/openlibrary/venv/bin/activate 
cd /opt/openlibrary/openlibrary
sudo make test
```

# Integration Tests

Integration tests use the Splinter webdriver with Google Chrome. For instructions on installation requirements and running integration tests, [see Integration Tests README](tests/integration/README.md). Integration tests are **not** run automatically and they require a non-headless machine (i.e. a web browser is currently required). You can do this on your local machine (not in vagrant) within your tmp directory:

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

*On Account My-books Pages*

TODO