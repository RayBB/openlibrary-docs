# Importing Internet Archive Open Libraries Wishlist
Coming up... I'll have more information shortly (after checking in with @mattmiller who developed the wishlist)

- Download the `wishlist`dataset from https://github.com/internetarchive/openlibrary/issues/869 (@mek will provide an updated link)
- We will take the first 1,000 items in the wishlist (as a test) and see (2.a.) how many are in Open Library...
    - As a first run, we can check these 1,000 wishlist items against the Open Library `books API`: https://openlibrary.org/dev/docs/api/books. *This won't scale to 2.6M editions* which is how many are on the wishlist. So, instead, we'll need to try 2.b:
    - First, we'll want to download the `editions` data dump https://openlibrary.org/data/ol_dump_editions_latest.txt.gz