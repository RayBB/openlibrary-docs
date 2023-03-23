# Using a Debugger
BETA: See https://github.com/internetarchive/openlibrary/pull/2097

Using a debugger is one of the best ways to understand how code works and to find bug fixes. We use [VS Code](https://code.visualstudio.com/) (along with its [Python extension](https://marketplace.visualstudio.com/items?itemName=ms-python.python)) to remote debug into the docker container; we can't use regular debugging because the docker container behaves like a virtual machine.

![Debugger in action](https://user-images.githubusercontent.com/6251786/56706388-bd889e00-66e2-11e9-9d9b-449f0458305a.gif)

To use:
1. `docker compose up -d` as usual and [**login as admin**](https://github.com/internetarchive/openlibrary/wiki/Getting-Started#logging-in). (Note this has to be done before changing the docker-compose file; see https://github.com/internetarchive/openlibrary/issues/2122 )
2. Open the repo in VS Code -- `code .`
3. Edit around line 8 of `docker-compose.yml` to say `workers 1` instead of `4`
4. `docker compose up -d`
5. Go to http://localhost:8080/admin/attach_debugger and click "Start"
6. Go to the debug panel (Ctrl+Shift+D) in VS Code, and click "Python: Attach"
7. Debug!

# Debugging a Server Error

**Question:** What should I do when I come across an internal error (like the one below) while running Open Library locally on Docker? 
```
"Sorry. There seems to be a problem with what you were just looking at. We've noted the error 2019-02-05/193353339339 and will look into it as soon as possible. Head for home?"
```
**Answer:** When you hit an error, if you add `?debug=true` to the url (if it's a GET), or (if it's a POST) inspect the form element and add `?debug=true` to the action url, you should see a useful stack trace.