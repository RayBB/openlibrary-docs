## Checklist for Deployment

1. [ ] Check merged PRs to get an idea of potential risks (update dates): https://github.com/internetarchive/openlibrary/pulls?q=is%3Apr%20is%3Amerged%20merged%3A2021-04-28T23%3A39%3A46Z..2021-05-06T19%3A05%3A48Z%20sort%3Aupdated-asc
2. [ ] Open up monitoring dashboards (We recommend adding these (along with this guide) to a bookmark folder; then you can click "Open all" when you're about to do a deploy!)
    - Grafana: https://wwwb-grafana0.us.archive.org/d/000000176/open-library-dev?orgId=1&refresh=1m
    - Haproxy: https://openlibrary.org/admin?stats
    - Sentry ol-web: https://sentry.archive.org/sentry/ol-web/
    - Sentry ol-covers: https://sentry.archive.org/sentry/ol-covers/
    - Sentry ol-infobase: https://sentry.archive.org/sentry/ol-infobase/
3. [ ] Confirm staging is working as expected: http://staging.openlibrary.org:9090/
4. [ ] Warn slack channels `#openlibrary-g` and `#openlibrary` of deploy and momentary downtime
5. [ ] Deploy to Production
    - `ssh -A ol-home0`
        ```sh
        time /opt/openlibrary/scripts/deployment/deploy.sh  # TODO: Add timing (takes a while)
        ./scripts/deployment/are_servers_in_sync.sh
        # Ensure all the git repos are in sync across all servers
        
        # Deploy the static files to ol-www1 ; this will not be needed once it's using docker
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