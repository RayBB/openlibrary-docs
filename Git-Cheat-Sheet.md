# Table of Contents

- [Forking and Cloning the Open Library Repository](#forking-and-cloning-the-open-library-repository)
- [Creating a Pull Request](#creating-a-pull-request)
- [Troubleshooting Your Pull Request](#troubleshooting-your-pull-request)
- [Making Updates to Your Pull Request](#making-updates-to-your-pull-request)
- [Commit History Manipulation](#commit-history-manipulation)
- [Resolving Rebase Conflicts](#resolving-rebase-conflicts)

## Forking and Cloning the Open Library Repository

### Fork the Open Library repository

Fork the Open Library repository using the GitHub UI by logging in to GitHub, going to [https://github.com/internetarchive/openlibrary](https://github.com/internetarchive/openlibrary) and clicking the Fork button in the upper right corner:
![GitHub Fork](https://archive.org/download/screenshot20191211at11.12.56/fork.jpg)

### Clone the forked repository on to your local computer

This creates a local copy of your own fork of the Open Library repository, in a directory called *openlibrary*. Your fork on the GitHub servers is a remote called *origin*. By default, you are looking at the *master* branch.

Make sure you `git clone` openlibrary using `ssh` instead of `https` as git submodules (e.g. `infogami` and `acs`) may not fetch correctly otherwise.

```sh
git clone git@github.com:USERNAME/openlibrary.git
```

#### Permission denied while cloning

If you have not added your public SSH key to GitHub you may see:

```sh
git@github.com: Permission denied (publickey).
fatal: Could not read from remote repository.
```

To fix this, first [generate a new SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) if you have not already done so, and then [add the SSH key to your GitHub account](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account).

#### Modifying a repository wrongly cloned with `https` (or one that is missing the infogami module)
You can modify an existing openlibrary repository that was inadvertently cloned with `https` by running:
```sh
git remote rm origin
git remote add origin git@github.com:USERNAME/openlibrary.git
git submodule init; git submodule sync; git submodule update
```

#### Fix line endings, symlinks and git submodules (only for Windows users not using a Linux VM)

Here, the project files need LF line endings because they are used in a Linux Docker container, even if run from Windows. Additionally, symlinks don't clone properly, and this creates issues for the git submodules, among other things.

For more on git and line endings, see [Configuring Git to handle line endings](https://docs.github.com/en/get-started/getting-started-with-git/configuring-git-to-handle-line-endings).

**Note: if you get permission issues while executing these commands please run git the bash shell as an Administrator.**

```sh
# Get in the project directory
cd openlibrary

# Configure Git to keep LF line endings on checkout even on Windows.
git config core.autocrlf input

# Enable symlinks
git config core.symlinks true

# Build submodules
git submodule init; git submodule sync; git submodule update

# Stage indexed files for removal so git reset updates them
git rm --cached -r .  # Don't forget the "."

# Reset the repo (removes any changes you've made to files and is likely to give an error if not administrator)
git reset --hard      # You will almost certainly need to use git-bash as administrator for this.
```

### Add 'upstream' repo to list of remotes

```sh
cd openlibrary
git remote add upstream https://github.com/internetarchive/openlibrary.git
```

### Verify the new remote named 'upstream'

```sh
$ git remote -v
origin  git@github.com:USERNAME/openlibrary.git (fetch)
origin  git@github.com:USERNAME/openlibrary.git (push)
upstream        https://github.com/internetarchive/openlibrary.git (fetch)
upstream        https://github.com/internetarchive/openlibrary.git (push)
```
Note that `origin` is `git@`. If it is not, see [Forking and Cloning the Open Library Repository](#forking-and-cloning-the-open-library-repository).

## Creating a Pull Request

1. Make sure master is up-to-date:

```sh
git switch master
git pull upstream master
git push origin master
```

2. [Create a new branch for the feature or issue you plan to work on](https://github.com/internetarchive/openlibrary/blob/master/CONTRIBUTING.md#development-practices) and check it out.

```sh
git switch -c 1234/fix/fix-the-thing
```

(specifying `-c` creates a new branch, and `switch` switches to it).

3. Make changes/commit:

```sh
git add the-file.html
git commit
```

A commit message should answer three primary questions;
* Why is this change necessary?
* How does this commit address the issue?
* What effects does this change have?

4. Push the branch:

```sh
git push origin HEAD
```
(note HEAD refers to your current branch; so make sure you're on the right branch!)

5. Test your changes:

```sh
docker compose run --rm home make test
```
| Info |
| --- |
| When the PR is submitted, the Continuous Integration (CI) server will [lint](https://en.wikipedia.org/wiki/Lint_(software)) (i.e. statically analyze code for bugs and stylistic bugs) the code and attempt to fix any errors it finds. If the errors require human intervention, the checks may fail. See [Linting](https://github.com/internetarchive/openlibrary/wiki/Testing#linting).
| If the checks fail, you can simply change the code and resubmit, but to prevent repeated resubmits you can optionally pre-lint the code before submitting by using `docker compose run --rm home npm run lint` to do a one-off JS lint or by [setting up `pre-commit`](https://github.com/internetarchive/openlibrary/wiki/Testing#lint-everything-with-pre-commit-from-your-shell-outside-of-docker) to run all the checks with each commit. |

6. Go to [https://github.com/internetarchive/openlibrary/pulls](https://github.com/internetarchive/openlibrary/pulls) and make new pull-request from branch in your forked repository and provide the information requested in the template.
![GitHub pull request](https://archive.org/download/screenshot20191211at11.12.56/pull-request.png)

Your code is now ready for review!

## Troubleshooting Your Pull Request
### Failing the `Generate POT` check
If your commit involves adding removing or altering text that will be visible to the user and is [properly internationalized](https://github.com/internetarchive/openlibrary/wiki#internationalization-i18n-developers-guide), an update of the translation template file will be automatically bundled in with your changes via `pre-commit`.

What this means:
If you're [running `pre-commit` locally](https://github.com/internetarchive/openlibrary/wiki/Testing#lint-everything-with-pre-commit-from-your-shell-outside-of-docker):
- Your code will "fail" a test called `Generate POT`, and give you the error message `Files were modified by this hook`, and add `messages.pot` changes to your git unstaged changes.
- All you need to do to "pass" the test is add the `messages.pot` file to staging and redo your commit; the test should now all pass, and your changes will be immediately available to translators once your branch is merged. 

If you're not running `pre-commit` locally:
- Your code will "fail" the `pre-commit` check run by the GitHub Continuous Integration (CI) server
- The CI will then push a new commit to your remote branch that contains the necessary `messages.pot` updates and now passes the `pre-commit` check 
- You don't need to do anything else after this, but if you want to make and push further changes to the PR, it would be wise to first run a `git pull origin HEAD` to pull in the new `messages.pot` changes and avoid conflicts in future pushes

## Making Updates to Your Pull Request

Pull requests often receive feedback; to make changes to your existing pull requests:

1. Make sure your branch is up-to-date with master

```sh
git switch master
git pull upstream master
```

2. Rebase your branch onto master

```sh
git switch 1234/fix/fix-the-thing
git rebase master
```

| Info |
| --- |
| Rebasing is the equivalent of "lifting" all the commits in your branch, and placing them on top of the latest master. It effectively changes the *base* of your branch/commits. |

| Info |
| --- |
| Sometimes there will be changes in the master branch to the same lines in your branch. This results in a conflict, because `git` can't decide which changes to use. See [Resolving rebase conflicts](#resolving-rebase-conflicts). |

3. Make your edits and commit (same as steps 3 in [Creating a Pull Request](#creating-a-pull-request)).

4. Push your changes up.

```sh
git push origin HEAD
```

**Note**: If the master rebase pulled in new changes, you will have to _force push_: `git push origin HEAD -f`.

| Info |
| --- |
| Force pushing _replaces_ the commits on the remote branch with the commits on your local branch. Non-force pushing just adds new commits. Whenever you perform a rebase, you will have to force push to your branch. |
| You should only force push if working on one of your own branches. If working on a branch which other people are also pushing to, force pushing is dangerous because it can override others' work. In that case, use `--force-with-lease`; this will force push _only_ if someone else hasn't made any changes to the branch. |

## Commit History Manipulation

**WARNING:** You can cause yourself some headaches with this feature! But it's easily one of the most powerful things about using `git`, so it's worth learning :)

Sometimes you'll want to rearrange/reword/combine commits to keep the history neat. To do this, on your branch, run:

```sh
git rebase -i master
```

| Info |
| --- |
| The `-i` is for interactive. The command is also specified often as something like `git rebase -i HEAD~2`. `HEAD` refers to the current, latest commit in your branch; `~2` goes back 2 in the history, so you'll be manipulating the last 2 commits. `git rebase -i master` lets you manipulate all the commits on your branch. |

| Info |
| --- |
| By default, `git` will open up an editor in your terminal (likely `vim`). If you would rather use VS Code, run `git config --global core.editor "code"` once, and then `git` will always use VS Code when prompting for a rebase, or a commit message. |
| If you happen to find yourself stuck in `vim` and don't know how to get out, press `ggdG:wq` (in order: `g` for "go to", `g` for "top of file", `d` for delete, `G` for "to bottom of file". So `ggdG` is for "go to the top of the file, and delete everything". This is how you cancel `git rebase -i`. Then: `:` for "enter command-line mode", `w` for "save", `q` for "quit". So `wq` is "save and quit". If you're interested in learning more about `vim`, see https://vim.fandom.com/wiki/Tutorial |

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

If you decide you want to cancel the rebase, delete everything, and then save. That tells `git` to do nothing.

To continue with the rebase, save the file. `git` will then replay all the instructions/commits in that file. If there is a conflict, it will pause to let you fix them. See [Resolving rebase conflicts](#resolving-rebase-conflicts).

## Resolving Rebase Conflicts

Sometimes when you `rebase` your branch, you will get conflicts! This happens when the master branch edited some of the same lines that your branch has edited, and `git` can't determine which changes to use. So it asks you to decide :)

If it hits a conflict during the rebase, it will stop, and let you fix it. I find fixing conflicts in VS Code to work well. In VS Code, open up the Source Control panel (Ctrl-Shift-G). Conflicts will be shown in red at the top with a "C" next to them. Click on the file to find and resolve the conflicts. Once you've resolved them all, press the "+" button next to the file in the source control panel; this is the same as running `git add FILE`. Once you've resolved all the conflicts, run `git rebase --continue` to continue the rebase.

If the conflicts look too much, and you want to abandon the rebase and go back to where your code was before, run `git rebase --abort`.

## References
- Getting Started flow roughly based on https://gist.github.com/Chaser324/ce0505fbed06b947d962