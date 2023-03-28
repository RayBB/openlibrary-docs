### Handling a conflicting PR
Sometimes, you will try to put a PR on testing, but it will conflict with another PR there, and be unable to be deployed.

To determine what PR is conflicting, find the block for your PR in the Jenkins dashboard for the PR Deploy:

1. Select the "ol-dev1-deploy (internal)" step
2. Select the "Build dev-merged" step
3. Expand the `git checkout` block

![f](https://github.com/internetarchive/openlibrary/wiki/images/Screenshot%202021-09-28%20123145.jpg)

4. Find your PR (`ctrl-f` for the PR number, or for `CONFLICT`)

```
origin pull/5644/head  
From https://github.com/internetarchive/openlibrary
 * branch                refs/pull/5644/head -> FETCH_HEAD

Removing openlibrary/templates/account/borrow.html
Auto-merging openlibrary/plugins/upstream/code.py
Auto-merging openlibrary/plugins/upstream/account.py
CONFLICT (content): Merge conflict in openlibrary/plugins/upstream/account.py
Automatic merge failed; fix conflicts and then commit the result.
```

4. Note the conflicting file, and `ctrl-f` for it to see which PR it came from.
5. If it is reasonable to do so, remove the PR from testing and trigger a new PR deploy.

### Removing a PR from `testing.openlibrary.org`

```sh
ssh -A ol-dev1
cd /opt/openlibrary
sudo vim _dev-merged.txt
# Find your PR by its number, and then remove the line.
# Then trigger another PR deploy.
```
### A note on `docker-compose` and `docker compose`

As of early 2023, following the installation instructions on Docker's website will install either Docker Desktop, which includes Docker Compose v2, or `docker-ce` and `docker-compose-plugin` (Linux only), both of which obviate the need to install `docker-compose` v1 separately.

Further, Compose V1 will [no longer be supported by the end of June 2023](https://docs.docker.com/compose/compose-v2/) and will be removed from Docker Desktop. These directions are written for Compose V2, hence the use of `docker compose` rather than `docker-compose`. `docker compose` is [meant to be a drop-in replacement](https://docs.docker.com/compose/compose-v2/#differences-between-compose-v1-and-compose-v2) for `docker-compose`.

To see an updated document, please review [Docker Instructions](https://github.com/internetarchive/openlibrary/blob/master/docker/README.md)

### Manually deploying to `testing.openlibrary.org`

```sh
cd /opt/openlibrary

# add PR number + comment with name
sudo vim /opt/openlibrary/_dev-merged.txt

# Pull down all branches
sudo ./scripts/make-integration-branch.sh _dev-merged.txt dev-merged

# restart service
export COMPOSE_FILE='docker-compose.yml:docker-compose.infogami-local.yml:docker-compose.staging.yml'
docker compose down
docker compose up -d web memcached

# Run any build steps that need re-running e.g. make js css, etc.
```