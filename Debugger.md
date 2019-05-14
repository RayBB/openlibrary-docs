BETA: See https://github.com/internetarchive/openlibrary/pull/2097

Using a debugger is one of the best ways to understand how code works and to find bug fixes. We use [VS Code](https://code.visualstudio.com/) (along with its [Python extension](https://marketplace.visualstudio.com/items?itemName=ms-python.python)) to remote debug into the docker container; we can't use regular debugging because the docker container behaves like a virtual machine.

![Debugger in action](https://user-images.githubusercontent.com/6251786/56706388-bd889e00-66e2-11e9-9d9b-449f0458305a.gif)

To use:
1. `docker-compose up -d` as usual and **login as admin**. Then `docker-compose down`. (see https://github.com/internetarchive/openlibrary/issues/2122 )
2. Open the repo in VS Code
3. Edit the last line of `docker/ol-docker-start.sh` to say `workers 1` instead of `4`
4. `docker-compose up -d`
5. Edit `.vscode/launch.json`:
  a. if using a docker machine (or docker toolbox), update `host` (run `docker-machine ip`)
  b. on Windows, I had to change `localRoot` to be `c:/Users/MyUser/openlibrary/`; if you get "file not found" errors, you might have to do the same.
6. Go to http://localhost:8080/admin/attach_debugger (or whatever your docker ip is) and click "Start"
7. Go to the debug panel (Ctrl+Shift+D) in VS Code, and click "Python: Attach"
8. Debug!