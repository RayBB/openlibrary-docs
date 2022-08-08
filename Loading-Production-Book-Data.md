## Loading Production Data into Local Developer Environment	

The local developer environment comes with a small pre-loaded data set. Some developer tasks require importing more or specific records from production into their local environment. These instructions achieve this import:	

```bash	
docker-compose exec web bash  # Connect to the docker image
export PYTHONPATH=.
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

Covers don't quite work correctly on the local environment. To test something with covers, change `coverstore_url` inside `conf/openlibrary.yml` to point to the production covers (covers.openlibrary.org). Avoid uploading when this is set.