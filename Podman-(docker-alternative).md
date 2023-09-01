**These docs are in beta and not officially supported but please help improve them** 

For Docker instructions read [here](https://github.com/internetarchive/openlibrary/blob/master/docker/README.md).

Docker is quite resource intensive on Mac so I'm going to try to get OL running on Podman.

First you'll need to install it:
`brew install podman podman-compose`

Then create a machine:
`podman machine init --cpus 4 --memory=4096`

Then start it:
`podman machine start`

Next cd to the ol directory and try building the images:
`podman-compose build`

To start the service run:
`podman-compose up`


# Current status
This doesn't work. It runs into a problem with npm install where it has seg fault when installing yorkie.
```
npm info run yorkie@2.0.0 install node_modules/yorkie node bin/install.js
npm timing metavuln:cache:put:security-advisory:css-select:6Q3WcbvCox+C7jCzBi55fZu7PzLgUFPqZ7bcQ5yyZqIQMyth+QuMQSRfPoYl0ho+43ONGo8WToe5RX6Nmn+azg== Completed in 623ms
npm timing metavuln:calculate:security-advisory:css-select:VShbb2pbM9iksRuYGUI6WhS0c/9djVcfoEfWXIwFzEBhRVrRSuTCDa9vjezd0osgxCl3EdqFIbu2HDodpf6EMw== Completed in 4965ms
npm timing metavuln:cache:get:security-advisory:datatables.net-dt:Bbw3sESqP1OPunNQ02XYw1toA3LLVld2JlXbi/54Kn1UVcy2Mge4VPkHvKaBrynzpT1N463DPjm/3N72XeSrcg== Completed in 23ms
Segmentation fault (core dumped)
Error: building at STEP "RUN npm install yorkie --verbose": while running runtime: exit status 139
```

Current plan is to try upgrading nodejs and see if that helps at all. Maybe it's running out of memory.

PS: some of these complications may be due to me running on m1 mac / arm64.