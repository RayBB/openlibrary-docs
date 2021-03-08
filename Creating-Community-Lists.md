Open Library has an account specifically for featuring organization-vetted lists:
https://openlibrary.org/people/booklists

1. An administrator may login to this account by going to:
https://openlibrary.org/admin/people/booklists

Note: You must be logged in to Open Library in order to create or add to a list.

2. Once logged in, a list must be created manually for at least 1 seed and given a "title" and a "description".

3. At this point, the list should exist and appear under the booklists account's lists page:
e.g. https://openlibrary.org/people/booklists/lists/OL194558L/International_Women%27s_Day_Celebrate_Women_Authors

4. Next, open up your browser's developer javascript console by pressing "control + shift + i" (linux/windows) or right-click on page and select the "Inspect" option in the right-click menu. Navigate to the `console` tab which will let you submit code.

5. If you know the Open Library IDs (olids) of works and editions in advance, you may use the following javascript incantation to add them in bulk to the list you created above.

6. Remove the human readable slug portion of the URL from step (3) -- in this example "/International_Women%27s_Day_Celebrate_Women_Authors" -- and add /seeds.json:
e.g. https://openlibrary.org/people/booklists/lists/OL194558L/seeds.json

This url will be added into line 1 of the code below:

```
await fetch("https://openlibrary.org/people/booklists/lists/OL194558L/seeds.json", {
    "credentials": "include",
    "body": JSON.stringify({add: [
       // IDs here
     ]}),
    "method": "POST",
    "mode": "cors"
});
```

Replace the `// IDs here` with a list of IDs of the form `{key: '/works/OL20008022W'}, ...`

7. A complete example should look like:

```
await fetch("https://openlibrary.org/people/booklists/lists/OL194558L/seeds.json", {
    "credentials": "include",
    "body": JSON.stringify({add: [
       {key: '/works/OL20008022W'}, {key: '/works/OL5731542W'}, {key: '/works/OL19966826W'},
       {key: '/works/OL8476068W'}, {key: '/works/OL2335989W'}, {key: '/works/OL21097322W'},
     ]}),
    "method": "POST",
    "mode": "cors"
});
```

Note: I (@mekarpeles) believe this list is limited to either 50 or 100 keys at a time. And a key must be of the form `/works/OL...W` or `/books/OL...M`, etc. They can't be urls like `https://openlibrary.org/works/OL...W` and they can't include slugs like `/works/OL...W/hello-world`.
