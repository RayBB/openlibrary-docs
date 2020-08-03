# Debugging a Server Error

**Question:** What should I do when I come across an internal error (like the one below) while running Open Library locally on Docker? 
```
"Sorry. There seems to be a problem with what you were just looking at. We've noted the error 2019-02-05/193353339339 and will look into it as soon as possible. Head for home?"
```
**Answer:** When you hit an error, if you add `?debug=true` to the url (if it's a GET), or (if it's a POST) inspect the form element and add `?debug=true` to the action url, you should see a useful stack trace.

# Using a Debugger
BETA: See https://github.com/internetarchive/openlibrary/pull/2097

Using a debugger is one of the best ways to understand how code works and to find bug fixes. We use [VS Code](https://code.visualstudio.com/) (along with its [Python extension](https://marketplace.visualstudio.com/items?itemName=ms-python.python)) to remote debug into the docker container; we can't use regular debugging because the docker container behaves like a virtual machine.

![Debugger in action](https://user-images.githubusercontent.com/6251786/56706388-bd889e00-66e2-11e9-9d9b-449f0458305a.gif)

To use:
1. `docker-compose up -d` as usual and **login as admin**. Then `docker-compose down`. (see https://github.com/internetarchive/openlibrary/issues/2122 )
2. Open the repo in VS Code
3. Edit the last line of `docker/ol-docker-start.sh` to say `workers 1` instead of `4`
4. `docker-compose up -d`
5. If using a docker machine (or docker toolbox), edit `.vscode/launch.json` and update `host` (run `docker-machine ip` to find the ip to use)
6. Go to http://localhost:8080/admin/attach_debugger (or whatever your docker ip is) and click "Start"
7. Go to the debug panel (Ctrl+Shift+D) in VS Code, and click "Python: Attach"
8. Debug!



Admin login troubles:

- Should login as openlibrary@example.com / admin123
- If you ever logged in with something else, it goes a little crazy; reset your docker volumes: `docker-compose build web` and then log in again
(TODO: Move this to a better documentation page)