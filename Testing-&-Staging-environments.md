### Handling a conflicting PR
Sometimes, you will try to put a PR on testing, but it will conflict with another PR there, and be unable to be deployed.

To determine what PR is conflicting, find the block for your PR in the Jenkins dashboard for the PR Deploy:

1. Select the "Build dev-merged" step
2. Expand the `git checkout` block

![f](https://github.com/internetarchive/openlibrary/wiki/images/Screenshot%202021-09-28%20123145.jpg)

3. Find your PR (`ctrl-f` for the PR number, or for `CONFLICT`)

```
origin pull/5644/head  
From https://github.com/internetarchive/openlibrary
 * branch                refs/pull/5644/head -> FETCH_HEAD

Removing openlibrary/templates/account/borrow.html
Auto-merging openlibrary/plugins/upstream/code.py
Auto-merging openlibrary/plugins/upstream/account.py
CONFLICT (content): Merge conflict in openlibrary/plugins/upstream/account.py
Automatic merge failed; fix conflicts and then commit the result.
```

4. Note the conflicting file, and `ctrl-f` for it to see which PR it came from.
5. If it is reasonable to do so, remove the PR from testing and trigger a new PR deploy.

### Removing a PR from testing

```sh
ssh -A ol-dev1
cd /opt/openlibrary
sudo vim _dev-merged.txt
# Find your PR by its number, and then remove the line.
# Then trigger another PR deploy.
```