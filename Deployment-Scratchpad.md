## 2021-01-07 Deploy

1. [ ] @mek Modify fabfile to rsync ol code repos to the new servers in their expected directories
```sh
cp ol-home:/deploy/latest/opt/openlibrary ol-web1:/opt/openlibrary
```
2. [ ] @mek Run old-style deploy from ol-home
```sh
ssh -A ol-home
/olsystem/bin/deploy-code openlibrary
```

2. [ ] @mek Checkout infogami 7595ae7 on ol-home

---

3. [x] @cclauss ol-home0 pull latest code of all repo
4. [x] @cclauss ol-home0 build the image \*1
```sh
export COMPOSE_FILE="docker-compose.yml:docker-compose.production.yml"
docker-compose build --pull web
docker-compose run -uroot --rm home make i18n
```

4. [x] @cclauss Create /opt/olimages for everything 
    - [x] ol-web1
    - [x] ol-web2
    - [x] ol-covers0
    - [x] @cdrini ol-home0

```sh
sudo mkdir -p /opt/olimages
sudo chown root:staff /opt/olimages
sudo chmod g+w /opt/olimages
sudo chmod g+s /opt/olimages
```

5. [x] @cdrini Docker save image
```sh
cd /opt/openlibrary
docker image prune # Not necessary; but cleanup
echo "FROM oldev:latest" | docker build -t "oldev:$(git rev-parse HEAD)" -

cd /opt/olimages

time docker save oldev:latest | gzip > oldev_latest.tar.gz \*2
# ~3 min, final file 820 MB ; image in docker container ls was 2.6 GB
```

6. [x] ~Modify fabfile to~ rsync docker image to all the hosts 

```sh
cd /opt/olimages
# each takes ~18s
time rsync -a --no-owner --group --verbose oldev_latest.tar.gz "ol-web1:/opt/olimages/"
time rsync -a --no-owner --group --verbose oldev_latest.tar.gz "ol-web2:/opt/olimages/"
time rsync -a --no-owner --group --verbose oldev_latest.tar.gz "ol-covers0:/opt/olimages/"
```

6. [x] Do old style deploy using mek's code so that it doesn't try to rsync to ol-web{1,2} ol-covers0 ol-home0 \*4
    - Put mek's fabfile.py changes into `fab_file_changes.diff`


```sh
ssh -A ol-home
/olsystem/bin/deploy-code openlibrary
```

6. [x web1, x web2, x covers0] @cclauss git pull latest code

```sh
cd /opt/olsystem                    && sudo git pull origin master
cd /opt/booklending_utils           && sudo git pull origin master
cd /opt/openlibrary                 && sudo git pull origin master
cd /opt/openlibrary/vendor/infogami && sudo git pull origin master
cd /opt/openlibrary
```

7. [x web1, x web2, x covers0] docker load on all hosts \*3
    - The new docker image should have label "SHA" as well as "latest"
```sh
# ~2min
time docker image prune

# ~4min
time docker load < /opt/olimages/oldev_latest.tar.gz

cd /opt/openlibrary
echo "FROM oldev:latest" | docker build -t "oldev:$(git rev-parse HEAD)" -
```

### for node in ol-web{1,2} ol-covers0
7. [ ] Down / up
```sh
export COMPOSE_FILE="docker-compose.yml:docker-compose.production.yml"
# WARNING! Moment of downtime 😬 
docker-compose down
docker volume rm openlibrary_ol-vendor openlibrary_ol-build openlibrary_ol-nodemodules
docker-compose up --no-deps -d --scale covers=2 covers_nginx memcached
```

```sh
export COMPOSE_FILE="docker-compose.yml:docker-compose.production.yml"
docker-compose down
# Remove these because they contain stale copies of the build/vendor/nodemodules files.
# Want to use the files inside the docker image, since it's freshly built.
# NOTE: longer term, we likely don't want these volume mount for production
docker volume rm openlibrary_ol-vendor openlibrary_ol-build openlibrary_ol-nodemodules
docker-compose run -uroot --rm home make i18n
HOSTNAME="$HOSTNAME" docker-compose up --no-deps -d web
```

### Notes

1. Hit a docker error: `ERROR: Couldn't connect to docker daemon` . Was not in docker group

```
# Make sure you're in the docker group, to avoid sudo-ing all the docker commands
sudo usermod -aG docker USER_NAME
# Exit/re-enter to take effect
```

2. We might want a date-based instead of SHA-based image label, so that this is more human readable (maybe `date +%Y-%m-%dT%H%M`)

3. It looks like `docker load` reloads all the layers!

Here is `docker image ls` before:

```
drini@ol-web1:/opt/olimages$ docker image ls
REPOSITORY           TAG                 IMAGE ID            CREATED             SIZE
oldev                latest              24e7730de44e        3 weeks ago         2.55GB
openlibrary/olbase   latest              7107cde0123e        4 weeks ago         2.43GB
openlibrary/olbase   <none>              e7ad65c36ade        5 weeks ago         2.45GB
openlibrary/olbase   <none>              5bc304b7af6a        6 weeks ago         2.46GB
openlibrary/olbase   <none>              8b9ba7350023        8 weeks ago         2.46GB
openlibrary/olbase   <none>              089f94fd1626        8 weeks ago         2.45GB
```

It notes: 
```
The image oldev:latest already exists, renaming the old one with ID sha256:24e7730de44e45356224fd9ec0f58eb39ef104f5e38b28227ff100ed67a1d0f6 to empty string
Loaded image: oldev:latest
```
After:
```
drini@ol-web1:/opt/olimages$ docker image ls
REPOSITORY           TAG                 IMAGE ID            CREATED             SIZE
oldev                latest              8b1a1ec051bf        About an hour ago   2.58GB
<none>               <none>              24e7730de44e        3 weeks ago         2.55GB
openlibrary/olbase   latest              7107cde0123e        4 weeks ago         2.43GB
openlibrary/olbase   <none>              e7ad65c36ade        5 weeks ago         2.45GB
openlibrary/olbase   <none>              5bc304b7af6a        6 weeks ago         2.46GB
openlibrary/olbase   <none>              8b9ba7350023        8 weeks ago         2.46GB
openlibrary/olbase   <none>              089f94fd1626        8 weeks ago         2.45GB
```

4. TODO for @cdrini: Remove all refs to ol-solr2 in olsystem

## 2020-12-10 Deploy

THINGS I FORGOT TO DO:
- `docker-compose run -uroot --rm home make i18n` (Added after-the-fact)

1. [x] On web{1,2} chown /booklending_utils
```sh
sudo chown 999:staff -R /opt/booklending_utils
sudo chmod g+w -R /opt/booklending_utils
sudo find /opt/booklending_utils -type d -exec chmod g+s {} \;
```

2. [x] Do a classic deploy so that ol-www1 has up-to-date static files
    - [x] Confirm web{3,4} not restarted

### for node in web{1,2}:
1. [x, x] Down
(down first so code in memory that's currently running is not out-of-sync with what's on the filesystem)
```sh
export COMPOSE_FILE="docker-compose.yml:docker-compose.production.yml"
docker-compose down
```

2. [x, x] Checkout
```sh
cd /opt/olsystem
git pull origin master
cd /opt/openlibrary
git pull origin master
cd /opt/openlibrary/vendor/infogami
git pull origin master
cd /opt/booklending_utils
git pull origin master
```

3. [x, x] Build
```sh
export COMPOSE_FILE="docker-compose.yml:docker-compose.production.yml"
docker-compose build --pull web
docker-compose run -uroot --rm home make i18n
```

4. [x, x] Restart
```sh
export COMPOSE_FILE="docker-compose.yml:docker-compose.production.yml"
HOSTNAME=$HOSTNAME PYENV_VERSION=3.8.6 docker-compose up -d --no-deps web
```

Sort of issue? On web2, got a weird issue; `git pull origin master` was not pulling that latest infogami. We think this is because of some odd funny business with .git and /openlibrary (which contains .git) being mounted.
  - **Seems like I forgot the COMPOSE_FILE**

---

Note: need to build to JS and everything else as well!

What is the status of https://github.com/internetarchive/openlibrary/issues/2032 ?

Option:
1) Merge your olsystem PR, and test running the old deploy code (should do checkout on all the nodes)
>> 2) Manually do it


Option:
1) Try to docker save/load, and only build on ol-home
   - If we didn't mount /openlibrary...
>> 2) Do it manually


ol-www1 is what serves static files, so we need a way to build the js/css/components (inside docker), and then copy the files over to ol-www1




Creates a tar:
docker save oldev:latest

??? Get to the other servers

docker load oldev.tar oldev:14f
docker tag oldev:14f latest

