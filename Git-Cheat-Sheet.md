`Git` adds/changes its feature-set regularly, so make sure to keep it up-to-date! These notes created with `git 2.22`.

Contents:
- [Main Git Flow](#main-git-flow)
- [Making Updates to Your Pull Request](#making-updates-to-your-pull-request)
- [Commit History Manipulation](#commit-history-manipulation)

## Main Git flow
1. Fork the Open Library repository using the GitHub UI by logging in to Github, going to [https://github.com/internetarchive/openlibrary](https://github.com/internetarchive/openlibrary) and clicking the Fork button in the upper right corner:
![GitHub Fork](https://archive.org/download/screenshot20191211at11.12.56/fork.jpg)

2. Clone your fork to your local machine:

```sh
git clone git@github.com:USERNAME/openlibrary.git
git remote add origin https://github.com/USERNAME/openlibrary.git
```

3. Add 'upstream' repo to list of remotes

```sh
git remote add upstream https://github.com/internetarchive/openlibrary.git#
```

4. Verify the new remote named 'upstream'

```sh
git remote -v
```

5. Make sure master is up-to-date:

```sh
git checkout master
git pull upstream master
```

6. [Create a new branch for the feature of issue you plan to work on](https://github.com/internetarchive/openlibrary/blob/master/CONTRIBUTING.md#development-practices) and check it out.

```sh
git checkout -b 1234/fix/fix-the-thing
```

(specifying `-b` creates a new branch, and `checkout` checks it out).

7. Make changes/commit:

```sh
git add the-file.html
git commit
```

A commit message should answer three primary questions;
* Why is this change necessary?
* How does this commit address the issue?
* What effects does this change have?

8. Push the branch:

```sh
git push origin HEAD
```
(note HEAD refers to your current branch; so make sure you're on the right branch!)

9. Test your changes:

```sh
docker-compose exec web make test
```

10. Go to [https://github.com/internetarchive/openlibrary/pulls](https://github.com/internetarchive/openlibrary/pulls) and make new pull-request from branch in your forked repository and provide the information requested in the template.
![GitHub pull request](https://archive.org/download/screenshot20191211at11.12.56/pull-request.png)

11. Your code is now ready for review!

## Making Updates to Your Pull Request

Pull requests often receive feedback; to make changes to your existing pull requests:

1. Make sure your branch is up-to-date with master

```
git checkout master
git pull upstream master
```

2. Rebase your branch onto master

```
git checkout 1234/fix/fix-the-thing
git rebase master
```

| Info |
| --- |
| Rebasing is the equivalent of "lifting" all the commits in your branch, and placing them on top of the latest master. It effectively changes the *base* of your branch/commits. |

3. Make your edits and commit (same as steps 7-9 in the [Main Git Flow](#main-git-flow))


## Commit History Manipulation

**WARNING:** You can cause yourself some headaches with this feature! But it's easily one of the most powerful things about using `git`, so it's worth learning :)

Sometimes you'll want to rearrange/reword/combine commits to keep the history neat. To do this, on your branch, run:

```
git rebase -i master
```

| Info |
| --- |
| The `-i` is for interactive. The command is also specified often as something like `git rebase -i HEAD~2`. `HEAD` refers to the current, latest commit in your branch; `~2` goes back 2 in the history, so you'll be manipulating the last 2 commits. `git rebase -i master` lets you manipulate all the commits on your branch. |

This will open a text editor, and let you edit all the commits that your branch has. It will look something like this:

```
pick eb8ab51 Made footer's HTML translatable
pick a18d382 Fixed some typos
pick 76b9883 Made footer's HTML translatable: added the missing translatable strings
pick 73c78b7 Fix git hash version i18n
pick 377e121 Added a missing translatable string
pick caf9507 Reverted unrelated changes to the PR
pick 23961be Clean up trailing whitespace

# Rebase ef7d551..23961be onto ef7d551 (7 commands)
#
# Commands:
# p, pick = use commit
# r, reword = use commit, but edit the commit message
# e, edit = use commit, but stop for amending
# s, squash = use commit, but meld into previous commit
# f, fixup = like "squash", but discard this commit's log message
# x, exec = run command (the rest of the line) using shell
# d, drop = remove commit
#
# These lines can be re-ordered; they are executed from top to bottom.
```

If you see something you don't expect in this file, delete everything, and then save. That tells `git` to do nothing.

## References
- Getting Started flow roughly based on https://gist.github.com/Chaser324/ce0505fbed06b947d962