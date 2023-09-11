**Hooking up a Javascript file to an HTML template**

A guide by Jaye R.

In this tutorial, I'll walk you through how to hook up a Javascript file to an HTML template in the Open Library code base. I will use my experience working on the 'Meet the Team' page on Open Library as an example.

## Step 1: Set up your environment

This tutorial assumes you already have an HTML template and a route created to display it on your browser. Go ahead and run the docker commands to pull up a local instance of the page -- we'll use it later.

## Step 2: Find where the Javascript files live in the Open Library code

All the Javascript files can be found in a [`js` folder](https://github.com/internetarchive/openlibrary/tree/master/openlibrary/plugins/openlibrary/js). The path to that folder is `openlibrary/plugins/openlibrary/js`.

## Step 3: Create a Javascript file

Inside the `js folder`, create a new Javascript file. Name it something meaningful -- what will this Javascript be doing? What page is it attached to?

    Ex: team.js

We'll come back to this file in a couple of steps. Next, let's take a closer look at the path the Javascript takes.

## Step 4: Look at the `index.js` file

This file is the gateway for the Javascript files on Open Library. If you scroll down, somewhere around line 68 is a comment that says `// Initialize some things` and beneath it is a line that says `jQuery`. The code block after it has a bunch of `if statements`. Those `if statements` are what we use to tell the HTML templates to load a Javascript file. A good example to look at is around line 490.

```
    // Add functionality for librarian merge request table:
    const librarianQueue = document.querySelector('.librarian-queue-wrapper')

    if (librarianQueue) {
        import(/* webpackChunkName: "merge-request-table" */'./merge-request-table')
            .then(module => {
                if (librarianQueue) {
                    module.initLibrarianQueue(librarianQueue)
                }
            })
    }
```

Let's break this code down. In the first line, we are using DOM manipulation to grab an item from the HTML with a class of `librarian-queue-wrapper` and storing it in a variable called `librarianQueue`. Next, we check if that item exists on the DOM with an `if statement`. If it exists, we want to import the Javascript file associated with `librarianQueue`, which is located at `'./merge-request-table'`.

Underneath the import statement, we have another `if statement` and finally, a function from the Javascript file to initialize the librarian queue. If you want, check out the `merge-request-table` folder to see what the functions do. Otherwise, we'll continue setting up our own Javascript in the next step.

## Step 5: Create the link in the `index.js`

We're going to do the same thing as the `librarianQueue` for the team page. There's a `div` on the team page template where the filtered cards will go -- I'll grab and use that in the `if statement`. If the `div` exists, import the Javascript on the `team` file we made earlier. Note that it's the location of the `team` file, not just the name.

```
    // Add functionality to the team page for filtering members:
    const teamCards = document.querySelector('.teamCards_container')

    if (teamCards) {
        import('./team')
            .then(module => {
                if (teamCards) {
                    module.initTeamFilter()
                }
            })
    }
```

We haven't actually made the `initTeamFilter` function yet, so let's do that in the next step.

## Step 6: Create the `initTeamFilter` function in `team.js`

This function will contain all of the Javascript the HTML template needs.

```
    export function initTeamFilter() {
        console.log("Hooked up")
    }
```

And that's it! When you build the Javascript with `docker compose run --rm home make js`, or with the watch script `docker compose run --rm home npm run-script watch`,
and reload the HTML template in the browser you should see "Hooked up" in the console.