# Table of Contents

- [Forking and Cloning the Open Library Repository](#forking-and-cloning-the-open-library-repository)
- [Working on Your Branch] (#working-on-your-branch)
- [Out-of-Sync Brances(#out-of-sync-branches)
- [Creating a Pull Request](#creating-a-pull-request)
- [Troubleshooting Your Pull Request](#troubleshooting-your-pull-request)
- [Making Updates to Your Pull Request](#making-updates-to-your-pull-request)
- [Commit History Manipulation](#commit-history-manipulation)
- [Resolving Rebase Conflicts](#resolving-rebase-conflicts)
- [Pre-commit and the GitHub CI](#pre-commit-and-the-github-ci)

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
# Get in the project root directory
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

## Working on Your Branch

Before creating a new branch and **each time** before working on an existing branch, make sure your master branch is up-to-date with upstream master 
```
git switch master
git pull upstream master
git push origin master
```
Create a new branch for your issue :
`git -c switch [issue number]/[fix/feature/hotfix]/[short issue description]`

Or, if you are returning to work on a previously created branch, rebase with master:
```
git switch [my/pre-existing/branch]
git rebase master
```
| Info |
| --- |
| Rebasing is the equivalent of "lifting" all the commits in your branch, and placing them on top of the latest master. It effectively changes the *base* of your branch/commits. |

| Info |
| --- |
| Sometimes there will be changes in the master branch to the same lines in your branch. This results in a conflict, because `git` can't decide which changes to use. See [Resolving rebase conflicts](#resolving-rebase-conflicts). |

Confirm that everything is up-to-date by running: `git status` 
The output should be: `Your branch is up to date with 'origin/[master or your-branch]'`

Check the status of your master and working branch on GitHub:
**Master**
<img width="777" alt="OL_Git_UpdatedMaster" src="https://github.com/internetarchive/openlibrary/assets/79802377/1c47c7dd-d56e-4098-8924-8689bd91b8a1">

**Your Branch**

Now, at long last, you can begin to make changes to your branch. 
When you are ready to commit your changes run:
```
git status [you'll see all the files you've made changes to]
git add . [stage all the changed files]
git commit -m '[Explanation of changes]'
git push origin [my/branch]
```

## Out-of-Sync Branches

Your master or working branch may get out-of-sync. In general, **do not use VSCODE or GITHUB MERGE** to resolve merge conflicts (See [Resolving rebase conflicts](#resolving-rebase-conflicts). Here are some commands to run for common out-of-sync situations:

**Master is behind upstream master**
```
git switch master
git pull upstream master
git push origin master
```
**Master is behind and ahead of upstream master**
```
git reset --hard HEAD~(the number you are ahead by)
git push -f origin master
```
**Working Branch is behind (it will always be ahead) of upstream master**
![OL_Git_UnsyncedBranch](https://github.com/internetarchive/openlibrary/assets/79802377/2074f643-1bf0-45aa-ab10-cb68e9763e78)

```
git switch master
git pull upstream master
git push origin master
git switch [my/branch]
git rebase master
git push origin [my/branch] (if master rebase pulled in new changes, use git push -origin HEAD -f )
```
If rebasing your branch still fails or provokes merge conflicts, see Troubleshooting. 

| Info |
| --- |
| Force pushing _replaces_ the commits on the remote branch with the commits on your local branch. Non-force pushing just adds new commits. Whenever you perform a rebase, you will have to force push to your branch. |

| You should only force push if working on one of your own branches. If working on a branch which other people are also pushing to, force pushing is dangerous because it can override others' work. In that case, use `--force-with-lease`; this will force push _only_ if someone else hasn't made any changes to the branch. |


## Creating a Pull Request

**1. Make sure master is up-to-date:**

```sh
git switch master
git pull --ff-only upstream master
git push origin master
```
**2. Test your changes:**

```sh
docker compose run --rm home make test
```
When you submit your pull request, the [GitHub CI server](#pre-commit-and-the-github-ci) will automatically run a few more tests and formatting checks. 

If you'd like, you can run these checks before you submit by [installing `pre-commit` locally](#running-pre-commit-locally-recommended), or run a [one-off formatting check](https://github.com/internetarchive/openlibrary/wiki/Testing#linting). 

**3. On GitHub, click Compare & pull request to confirm the commits and files changed are only the changes you have made on your working branch / intend for the PR
![OL_Git_PR](https://github.com/internetarchive/openlibrary/assets/79802377/d58c3d92-e281-4775-9eab-084490887d11)

If everything looks right, create your PR based on provided template - your our code is now ready for review!
If not, see [Troubleshooting](#troubleshooting)
If you continue to make changes to an open PR, follow steps in [Working on Your Branch](#working-on-your-branch) to make sure your branch stays up to date.
  

## Troubleshooting Your Pull Request
### Failing the `Generate POT` check
If your commit involves adding, removing or altering text that will be visible to the user and is [properly internationalized](https://github.com/internetarchive/openlibrary/wiki#internationalization-i18n-developers-guide), an update of the translation template file will be automatically bundled in with your changes via `pre-commit`. 

To learn more, see [Pre-commit and the GitHub CI](#pre-commit-and-the-github-ci).

**What this means:**

If you're running `pre-commit` locally:
- Your code will "fail" a test called `Generate POT`, give you the error message `Files were modified by this hook`, and add `messages.pot` changes to your git unstaged changes.
- All you need to do to "pass" the test is add the `messages.pot` file to staging and redo your commit; the `Generate POT` test should now pass, and your changes will be immediately available to translators once your branch is merged. 

If you're not running `pre-commit` locally:
- Your code will "fail" the `pre-commit` check run by the GitHub Continuous Integration (CI) server
- The CI will then push a new commit to your remote branch that contains the necessary `messages.pot` updates and now passes the `pre-commit` check 
- You don't need to do anything else after this, but if you want to make and push further changes to the PR, it would be wise to first run a `git pull origin HEAD` to pull in the new `messages.pot` changes and avoid conflicts in future pushes


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

## Pre-commit and the GitHub CI
To automatically ensure that certain formatting practices are maintained throughout the codebase, and that any incoming pull requests pass a set of requisite JavaScript and Python checks, Open Library uses GitHub's Continuous Integration (CI) Server with a set of [`pre-commit` hooks](https://pre-commit.com/) to run a series of automated checks on incoming PRs.

### The GitHub CI Server
If you don't have `pre-commit` installed locally and your PR fails any one of the checks, there are two things that may happen when you push your changes:
1. One of the checks initially fails, but then the `pre-commit` bot pushes a new commit for you that fixes the problem. If this is the case, you'll see a commit that looks like this:

<img width="782" alt="Pre-commit bot updates" src="https://github.com/internetarchive/openlibrary/assets/140550988/444c8708-e598-4562-babb-58ae2c49d2d2">

This means that the `pre-commit` bot auto-fixed the problem for you, which is very common in the case of simple formatting errors. In this case, you're all set, but if you plan on making any more changes to your branch, it's a good idea to pull in `pre-commit`'s changes with `git pull origin HEAD` to ensure you don't run into any conflicts.

2. The check simply fails and you'll see something that looks like this:

<img width="757" alt="Failing pre-commit check" src="https://github.com/internetarchive/openlibrary/assets/140550988/882f228a-a7dd-4385-81a6-a70895afe7b8">

This means that the problem that the CI identified requires human intervention, which means you'll want to click "Details" to see what exactly tripped up the test, try to fix the problem locally, and push up a new solution with `git push origin HEAD`. If you're not sure what is causing the error or how to fix it, this is a great time to reach out to the issue's lead for guidance on how to proceed.

### Running `pre-commit` Locally (Recommended)
To test everything the CI server checks (JavaScript, `mypy`, `black`, `ruff`, etc.), and to do so automatically at the time of commit, one can run, in the local environment, outside of Docker, a Python program named `pre-commit`. This will use `git`'s [hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) to run Open Library-specific linting checks when committing code in `git`. Because `pre-commit` integrates with `git`, that means it runs outside of Docker, and needs to be available to `git` in your current environment.

If you have `pre-commit` installed, the checks will run locally each time you add a commit to your branch. This way, you don't have to worry about re-pushing your changes every time you encounter a `pre-commit` error, which is especially nice in the case of simple formatting issues like trailing whitespace.

If your commit fails any of the checks, there are two things that may happen:
1. The check will initially fail and your staged changes will not be committed, but `pre-commit` will auto-add a new change that fixes the problem, in which case you'll see a new unstaged git change and something like this:

<img width="564" alt="pre-commit modifying files" src="https://github.com/internetarchive/openlibrary/assets/140550988/e0f3a63d-bd66-4057-a640-a8d751407d15">

All you need to do in this case is add the change to staging and commit again. The check should pass, and you should now be able to push your changes.

2. The check will simply fail, your staged changes will not be committed, and you'll see an error message like this:
<img width="561" alt="Failed mypy example" src="https://github.com/internetarchive/openlibrary/assets/140550988/bb5a6118-6e51-4710-9d6d-c1a542410b5e">

This means that the problem requires human intervention, which means that you can fix the problem locally, using the error message info and/or guidance from the issue's lead, and then re-commit and push your changes as needed. 

#### Installing `pre-commit`
Prerequisites:
- the version of your current Python interpreter must match the version of Python specified in the `default_language_version` section of [`.pre-commit-config.yaml`](https://github.com/internetarchive/openlibrary/blob/master/.pre-commit-config.yaml).

Although a complete discussion of managing Python's versions and Python's virtual environments is outside the scope of this discussion, it is likely worth creating a virtual environment for each Python project on which you work. See Python's own documentation about [`venv`](https://docs.python.org/3/library/venv.html) for one such approach to managing virtual environments. Additionally, if your `python3 --version` doesn't match the version specified in `.pre-commit-config.yaml`, consider [`pyenv`](https://github.com/pyenv/pyenv) on Linux, macOS, or Windows Subsystem for Linux, or [`pyenv-win`](https://github.com/pyenv-win/pyenv-win) on Windows outside of the Windows Subsystem for Linux.

*Note:* this will install a `git` commit hook that will run prior to every commit. As there are times where one may simply wish to commit code, even if it will fail the linting, **one can override commit hooks with `git commit --no-verify`**. For more on `pre-commit`, see https://pre-commit.com/.

To enable `pre-commit`, run the following in your local shell outside of Docker:
1. `pip install pre-commit` or `brew install pre-commit`; and
2. `pre-commit install`

Henceforth, `pre-commit` will lint your code with every `git commit` (unless you commit with `git commit --no-verify` to disable running the hooks). To manually run `pre-commit`, you can execute `pre-commit run --all-files`.

If you see an error similar to either of the following, please ensure you the version of you Python interpreter matches the version specified in `.pre-commit-config.yaml`:
```
An unexpected error has occurred: CalledProcessError: command: ('/home/scott/.pyenv/versions/3.9/bin/python3.9', '-mvirtualenv', '/home/scott/.cache/pre-commit/repolh5wc3hy/py_env-python3.11', '-p', 'python3.11')
return code: 1
stdout:
    RuntimeError: failed to find interpreter for Builtin discover of python_spec='python3.11'
stderr: (none)
Check the log at /home/scott/.cache/pre-commit/pre-commit.log
```

To remove `pre-commit`, run `pre-commit uninstall`.

## References
- Getting Started flow roughly based on https://gist.github.com/Chaser324/ce0505fbed06b947d962