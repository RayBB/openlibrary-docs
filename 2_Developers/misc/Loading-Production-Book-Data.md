## Loading Production Data into Local Developer Environment	

The local developer environment comes with a small pre-loaded data set. Some developer tasks require importing more or specific records from production into their local environment. The bash script instructions below achieve this import. Before this is listed, please see the note regarding Docker Compose versions.

### A note on `docker-compose` and `docker compose`

As of early 2023, following the installation instructions on Docker's website will install either Docker Desktop, which includes Docker Compose v2, or `docker-ce` and `docker-compose-plugin` (Linux only), both of which obviate the need to install `docker-compose` v1 separately.

Further, Compose V1 will [no longer be supported by the end of June 2023](https://docs.docker.com/compose/compose-v2/) and will be removed from Docker Desktop. These directions are written for Compose V2, hence the use of `docker compose` rather than `docker-compose`. `docker compose` is [meant to be a drop-in replacement](https://docs.docker.com/compose/compose-v2/#differences-between-compose-v1-and-compose-v2) for `docker-compose`.

To see an updated document, please review [Docker Instructions](https://github.com/internetarchive/openlibrary/blob/master/docker/README.md)	

```bash	
docker compose exec -e PYTHONPATH=. web bash  # Connect to the docker image
# Copy an author (JUST the author; no works)	
./scripts/copydocs.py /authors/OL1385865A	
# Outputs:	
#    fetching ['/authors/OL1385865A']	
#    saving ['/authors/OL1385865A']	
#    [{'key': '/authors/OL1385865A', 'revision': 1}]	
# Copy a work and all its editions/authors	
./scripts/copydocs.py /works/OL14906539W	
# Outputs:	
#    fetching ['/works/OL14906539W']	
#    found references ['/authors/OL30714A', '/authors/OL68291A', '/authors/OL1385865A', '/authors/OL1058879A', '/authors/OL238025A']	
#    fetching ['/authors/OL30714A', '/authors/OL68291A', '/authors/OL1385865A', '/authors/OL1058879A', '/authors/OL238025A']	
#    saving ['/authors/OL30714A', '/authors/OL1058879A', '/authors/OL238025A', '/authors/OL68291A', '/authors/OL1385865A']	
#    [{'key': '/authors/OL30714A', 'revision': 1}, {'key': '/authors/OL1058879A', 'revision': 1}, {'key': '/authors/OL238025A', 'revision': 1}, {'key': '/authors/OL68291A', 'revision': 1}]	
#    saving ['/works/OL14906539W']	
#    [{'key': '/works/OL14906539W', 'revision': 1}]	
# Copy an edition and its works/authors	
./scripts/copydocs.py /books/OL24966433M	
# Outputs:	
#    fetching ['/books/OL24966433M']	
#    found references ['/works/OL14906539W']	
#    fetching ['/works/OL14906539W']	
#    found references ['/authors/OL30714A', '/authors/OL68291A', '/authors/OL1385865A', '/authors/OL1058879A', '/authors/OL238025A']	
#    fetching ['/authors/OL30714A', '/authors/OL68291A', '/authors/OL1385865A', '/authors/OL1058879A', '/authors/OL238025A']	
#    saving ['/authors/OL30714A', '/authors/OL1058879A', '/authors/OL238025A', '/authors/OL68291A', '/authors/OL1385865A']	
#    []	
#    saving ['/works/OL14906539W']	
#    []	
#    saving ['/books/OL24966433M']	
#    [{'key': '/books/OL24966433M', 'revision': 1}]	
```	

Copydocs also supports queries:

```
./scripts/copydocs.py --search 'author_key:OL18053A' --search-limit 100
```

Covers don't quite work correctly on the local environment. To test something with covers, change `coverstore_url` inside `conf/openlibrary.yml` to point to the production covers (covers.openlibrary.org). Avoid uploading when this is set.