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