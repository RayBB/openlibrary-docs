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
export COMPOSE_FILE="docker-compose.yml:docker-compose.infogami-local.yml:docker-compose.production.yml"
docker-compose build --pull web
docker-compose run -uroot --rm home make i18n
```

4. [x, x] Restart
```sh
export COMPOSE_FILE="docker-compose.yml:docker-compose.infogami-local.yml:docker-compose.production.yml"
HOSTNAME=$HOSTNAME PYENV_VERSION=3.8.6 docker-compose up -d --no-deps web
```

Sort of issue? On web2, got a weird issue; `git pull origin master` was not pulling that latest infogami. We think this is because of some odd funny business with .git and /openlibrary (which contains .git) being mounted.
  - **Seems like I forgot the COMPOSE_FILE**

---

Note: need to build to JS and everything else as well!


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