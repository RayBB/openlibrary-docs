# Endpoints

An overview of the Open Library internal API.

- [Lists](#lists)
  - [Creating Lists](#creating-lists)
  - [Searching for Lists](#searching-for-lists)
- [Works](#works)
- [Editions](#editions)
- [Subjects](#subjects)


## Lists

### Creating Lists

### Addings Seeds to Lists

### Searching for Lists

In openlibrary/plugins/openlibrary/lists.py

    GET /lists/search?q=




## Works

### Creating Works

### Delete

In file openlibrary/plugins/upstream/addbook.py:

    GET https://openlibrary.org/books/(OL...M)/edit

Parameters:

    name="_delete"

Permissions:

User must be Administrator

Notes:

Deleting the last Edition of a Work via this endpoint will remove the Work also.

**[RESTful API](https://openlibrary.org/dev/docs/restful_api) Delete:**

    PUT https://openlibrary.org/works/(OL...W).json

Body:

    { 
      "type": { "key": "/type/delete" },
      "_comment": "<Reason for deletion>"
    }

Permissions:

User must be Administrator

Notes:

Attempting to delete a Work that still has editions should fail. (Needs verification!)
Deleting the last Work of an Author will not remove the Author record.

## Editions

### View

RESTful API

    GET https://openlibrary.org/books/(OL...M).json

### Create

### Edit

**[RESTful API](https://openlibrary.org/dev/docs/restful_api) Edit:**

    PUT https://openlibrary.org/books/(OL...M).json

Body:

    {
      < complete body of current record from GET request, modified as desired >
      "_comment": "<Description of changes>"
    }

### Merge

### Delete

In file openlibrary/plugins/upstream/addbook.py:

   https://openlibrary.org/books/(OL...M)/edit

Parameters:

   name="_delete"

Permissions:

User must be Administrator

**[RESTful API](https://openlibrary.org/dev/docs/restful_api) Delete:**

    PUT https://openlibrary.org/books/(OL...M).json

Body:

    { 
      "type": { "key": "/type/delete" },
      "_comment": "<Reason for deletion>"
    }

Permissions:

User must be Administrator

Notes:

Deleting the last Edition of a Work will **NOT** remove the Work. It has to be cleared separately.

## Subjects