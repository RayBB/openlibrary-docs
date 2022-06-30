## Checklist for Deployment

1. [ ] Check merged PRs to get an idea of potential risks (update dates): https://github.com/internetarchive/openlibrary/pulls?q=is%3Apr%20is%3Amerged%20merged%3A2021-04-28T23%3A39%3A46Z..2021-05-06T19%3A05%3A48Z%20sort%3Aupdated-asc
2. [ ] Open up monitoring dashboards (We recommend adding these (along with this guide) to a bookmark folder; then you can click "Open all" when you're about to do a deploy!)
    - Grafana: https://wwwb-grafana0.us.archive.org/d/000000176/open-library-dev?orgId=1&refresh=1m
    - Haproxy: https://openlibrary.org/admin?stats
    - Sentry ol-web: https://sentry.archive.org/sentry/ol-web/
    - Sentry ol-covers: https://sentry.archive.org/sentry/ol-covers/
    - Sentry ol-infobase: https://sentry.archive.org/sentry/ol-infobase/
3. [ ] Confirm staging is working as expected: http://staging.openlibrary.org
4. [ ] Warn slack channels `#openlibrary-g` and `#openlibrary` of deploy and momentary downtime
5. [ ] Follow one-time set-up instructions found [here](#setup-stuff)
6. [ ] Deploy to Production
    - `ssh -A ol-home0`
        ```sh
        cd /opt/openlibrary
        # Pull olystem and openlibrary before continuing
        # so we have latest docker-compose, etc
        # NOTE: Ensure that the `master` branch is checked out first.
        sudo git pull origin master

        time /opt/openlibrary/scripts/deployment/deploy.sh  # 15min
        ./scripts/deployment/are_servers_in_sync.sh
        # Ensure all the git repos are in sync across all servers
        
        # Deploy the static files to ol-www1 ; this will not be needed once it's using docker
        CUR_SHA=$(sudo git rev-parse HEAD | head -c7)        
        STATIC_DIR=/tmp/ol-static-$CUR_SHA
        docker cp $(docker create --rm openlibrary/olbase:latest):/openlibrary/static $STATIC_DIR
        rsync -rvz $STATIC_DIR/ ol-www1:$STATIC_DIR
        ssh -A ol-www1 "
          sudo rm -r /opt/openlibrary/openlibrary/static-backup || true;
          sudo chown -R openlibrary:openlibrary $STATIC_DIR;
          sudo mv /opt/openlibrary/openlibrary/{static,static-backup};
          sudo mv $STATIC_DIR /opt/openlibrary/openlibrary/static;
        "

        # Restart things (check the site and sentry after each)
        /opt/openlibrary/scripts/deployment/restart_servers.sh ol-web1 ol-covers0
        /opt/openlibrary/scripts/deployment/restart_servers.sh ol-home0 && docker restart openlibrary_infobase_nginx_1
        /opt/openlibrary/scripts/deployment/restart_servers.sh ol-web2
        # Not currently production facing
        /opt/openlibrary/scripts/deployment/restart_servers.sh ol-www0
        ````
- [ ] Notify slack of deploy completion

## Introduction

Greetings deployer! You are one of the select few who has privileged access to Internet Archive infrastructure and is tasked with the important responsibility of deploying the Open Library website. Deploys typically occur on Thursday, after the candidate code has had a few days to be tested on staging (https://staging.openlibrary.org). The following are instructions that we hope will ease your journey towards a successful deployment of the Open Library system. For more information on the system architecture, please refer to the [Production Provisioning Guide](https://github.com/internetarchive/openlibrary/wiki/Production-Service-Architecture) 


## Recovering from a Failed Deployment

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

On ol-home0, a live, breaking change could be made to certain services, e.g. `affiliate-service` which result in the service entering a restart loop. In order to fix this and resume from a clean-slate, the service may be taken down with:
`docker stop openlibrary_affiliate-server_1; docker rm openlibrary_afilliate-server_1` and then brought back up online with `PRODUCTION="docker-compose.yml:docker-compose.production.yml" HOSTNAME=$HOST OLIMAGE=openlibrary/olbase:latest docker-compose --profile affiliate-server up --build --no-deps -d .`

## Setup stuff
These things that only need to happen once:

1. Add your username to the `docker` group, using the following commands:
```sh
ssh -A ol-<host>
sudo usermod -a -G docker <your-username>
```
1. Request that a team member send you a Docker Hub invitation.
2. Ensure that you are in the `staff` group in `ol-home0`.
3. SSH from `ol-home0` to every other node, agreeing to the prompt with "yes".
