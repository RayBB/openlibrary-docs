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