## Setup

In order to conduct deploys, the following one-time setup steps must be performed:

1. Add your username to the `docker` group, using the following commands:
```sh
ssh -A ol-<host>
sudo usermod -a -G docker <your-username>
```
1. Request that a team member send you a Docker Hub invitation.
2. Ensure that you are in the `staff` group in `ol-home0`.
3. SSH from `ol-home0` to every other node, agreeing to the prompt with "yes".

## Checklist for Deployment

1. [ ] Check merged PRs to get an idea of potential risks (update dates): https://github.com/internetarchive/openlibrary/pulls?q=is%3Apr%20is%3Amerged%20merged%3A2021-04-28T23%3A39%3A46Z..2021-05-06T19%3A05%3A48Z%20sort%3Aupdated-asc
2. [ ] Open up monitoring dashboards (We recommend adding these (along with this guide) to a bookmark folder; then you can click "Open all" when you're about to do a deploy!)
    - Grafana: https://wwwb-grafana.us.archive.org/d/000000176/open-library-dev?orgId=1&refresh=1m
    - Haproxy: https://openlibrary.org/admin?stats
    - Sentry ol-web: https://sentry.archive.org/organizations/ia-ux/issues/?project=7
    - Sentry ol-covers: https://sentry.archive.org/organizations/ia-ux/issues/?project=10
    - Sentry ol-infobase: https://sentry.archive.org/organizations/ia-ux/issues/?project=9
    - Sentry ol-cron-jobs: https://sentry.archive.org/organizations/ia-ux/issues/?project=12
3. [ ] Confirm staging is working as expected: http://staging.openlibrary.org
4. [ ] Warn slack channels `#openlibrary-g` and `#openlibrary` of deploy and momentary downtime
5. [ ] Follow one-time set-up instructions found [here](#setup-stuff)
6. [ ] Deploy to Production
    - `ssh -A ol-home0`
        ```sh
        cd /opt/openlibrary
        # Pull olystem and openlibrary before continuing
        # so we have latest docker compose, etc
        # NOTE: Ensure that the `master` branch is checked out first.
        sudo git fetch origin master && sudo git reset --hard origin/master

        time /opt/openlibrary/scripts/deployment/deploy.sh  # 15min
        ./scripts/deployment/are_servers_in_sync.sh
        # Ensure all the git repos are in sync across all servers

        # Restart things (check the site and sentry after each)
        /opt/openlibrary/scripts/deployment/restart_servers.sh ol-www0
        /opt/openlibrary/scripts/deployment/restart_servers.sh ol-web1 ol-covers0
        /opt/openlibrary/scripts/deployment/restart_servers.sh ol-home0 && docker restart openlibrary-infobase_nginx-1
        /opt/openlibrary/scripts/deployment/restart_servers.sh ol-web2
        ````
- [ ] Notify slack of deploy completion

## Introduction

Greetings deployer! You are one of the select few who has privileged access to Internet Archive infrastructure and is tasked with the important responsibility of deploying the Open Library website. Deploys typically occur on Thursday, after the candidate code has had a few days to be tested on staging (https://staging.openlibrary.org). The following are instructions that we hope will ease your journey towards a successful deployment of the Open Library system. For more information on the system architecture, please refer to the [Production Provisioning Guide](https://github.com/internetarchive/openlibrary/wiki/Production-Service-Architecture).

To see an updated document, please review [Docker Instructions](https://github.com/internetarchive/openlibrary/blob/master/docker/README.md).

## Recovering from a Failed Deployment

### NPM Package-lock.json issues

See: https://github.com/internetarchive/openlibrary/pull/6965#issue-1372080408

* ssh'ing to `ol-home0` and cd'ing to `/opt/ol-mek`
* `sudo git stash && sudo git checkout master && sudo git pull origin master` 
* `sudo git checkout -b fix-package-lock`
* `sudo rm package-lock.json`
* `docker exec -it ol-mek_web_1 npm i`
* `sudo git add package-lock.json && sudo git commit -m "fix package lock" && git push origin fix-package-lock`
* opening && reviewing & merging a pull request for `fix-package-lock`
* `ssh -A ol-home0` and `cd /opt/openlibrary` and `git pull origin master`
* re-running build instructions from https://github.com/internetarchive/openlibrary/wiki/Deployment-Guide#checklist-for-deployment


### Rolling Back

To roll back to a previous deploy, run: `OLIMAGE="openlibrary/olbase:3f372be" /opt/openlibrary/scripts/deployment/restart_servers.sh ol-web1`, replacing the SHA with the sha you want to roll back to (run `docker image ls` for options).

Note:
- Only the last ~2 deploys are kept around
- You cannot rollback JS/CSS changes easily, since they are outside of the docker flow.

## Patch Deploying a PR

Sometimes, an issue will be high priority and must be deployed directly and independently of whatever else might be on master. To patch deploy a specific PR:

1. Go to eg `https://github.com/internetarchive/openlibrary/pull/5772.diff`, and copy the url (it will redirect)
2. Go to each web node
3. `docker exec -it openlibrary_web_1 bash` ([make sure your user is in the docker group](#adding-your-user-to-the-docker-group))
4. `curl 'URL' | git apply`
5. Exit the docker container `exit`
6. Restart the container `docker restart openlibrary_web_1`
7. Test that the fix is live
8. Add "Patch Deployed" label to the PR

### Reverting a Patch Deployment

A patch deployment can be reverted by following the above steps, adding `-R` to the end of step 4:
```
curl 'URL' | git apply -R
```

## Recovering from Restart Loops

On ol-home0, a live, breaking change could be made to certain services, e.g. `affiliate-service` which result in the service entering a restart loop. In order to fix this and resume from a clean-slate, the service may be taken down and brought back up (freshly) with:

```
docker stop openlibrary_affiliate-server_1
docker rm -f openlibrary_affiliate-server_1
COMPOSE_FILE="compose.yaml:compose.production.yaml" HOSTNAME=$HOSTNAME docker compose up -d affiliate-server
```

## Deployment Development

### Spin up a Vanilla Container for Dev

Once you've built a release of an `olbase` image, you can use the following command to spin up a vanilla container for testing commands:
`docker run -it --rm openlibrary/olbase:latest bash`. This is especially useful for testing whether deploys are working correctly and if commands (such as `npm ci`) succeed.

### Deploying to testing.openlibrary.org

Staff can deploy by using the **PR Deploy** bookmarklet (ask @cdrini).

This can be done manually by looking at the instructions within `_dev-merged.txt` on `ol-dev1:/opt/openlibrary`. The first step is to run the dev_merged script via `sudo ./scripts/make-integration-branch.sh _dev-merged.txt dev-merged` and then down-up the container:

```
cd /opt/openlibrary
sudo ./scripts/make-integration-branch.sh _dev-merged.txt dev-merged
docker compose down
COMPOSE_FILE="compose.yaml:compose.staging.yaml" HOSTNAME=$HOSTNAME docker compose up --no-deps -d memcached web
```


## Legacy Deployment for Various Environments

This may be outdated!

1. localhost for Developers -- http://localhost:8080/status
    * `export COMPOSE_FILE="compose.yaml:compose.override.yaml"`
2. dev or staging servers -- ol-dev01 is http://staging.openlibrary.org/status
    * `export COMPOSE_FILE="compose.yaml:compose.staging.yaml"`
3. production on multiple servers -- ol-web1 and ol-web2 are http://openlibrary.org/status
    * `export COMPOSE_FILE="compose.yaml:compose.production.yaml"`

Once you have set `$COMPOSE_FILE`, you can:
```
docker compose down && PYENV_VERSION=3.8.6 docker compose up -d && docker compose logs -f --tail=10
```

For more details see: https://github.com/internetarchive/openlibrary/blob/master/docker/README.md

The remainder of this document will focus on production deployments.

## Testing & Staging PR Deploys

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

### Manually deploying to `testing.openlibrary.org`

```sh
cd /opt/openlibrary

# add PR number + comment with name
sudo vim /opt/openlibrary/_dev-merged.txt

# Pull down all branches
sudo ./scripts/make-integration-branch.sh _dev-merged.txt dev-merged

# restart service
export COMPOSE_FILE='compose.yaml:compose.infogami-local.yaml:compose.staging.yaml'
docker compose down
docker compose up -d web memcached

# Run any build steps that need re-running e.g. make js css, etc.
```

### Rebuilding Dev Instances

For e.g. `ol-dev1:/opt/ol-mek` staff dev instances, use the following command (with the right ports) to rebuild.
```
sudo WEB_PORT=1337 COMPOSE_FILE="compose.yaml:compose.staging.yaml" docker compose build web
```