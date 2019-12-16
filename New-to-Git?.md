# GitHub Tips for Beginners
1. [Fork](https://gist.github.com/Chaser324/ce0505fbed06b947d962) the Open Library repository using the GitHub UI by logging in to Github, going to [https://github.com/internetarchive/openlibrary](https://github.com/internetarchive/openlibrary) and clicking the Fork button in the upper right corner:
![GitHub Fork](https://archive.org/download/screenshot20191211at11.12.56/fork.jpg)
2. Clone your fork to your local machine:

$ git clone git@github.com:USERNAME/openlibrary.git

$ git remote add origin https://github.com/USERNAME/openlibrary.git

3. Add 'upstream' repo to list of remotes

$ git remote add upstream https://github.com/internetarchive/openlibrary.git# 

4. Verify the new remote named 'upstream'

$ git remote -v

5. Make sure master is up-to-date:

$ git checkout master

$ git pull upstream master

6. [Create a new branch for the feature of issue you plan to work on](https://github.com/internetarchive/openlibrary/blob/master/CONTRIBUTING.md#development-practices) and check it out.

$ git checkout -b 1234/fix/fix-the-thing

7. Make changes/commit:

$ git add the-file.html

$ git commit

A commit message should answer three primary questions;
* Why is this change necessary?
* How does this commit address the issue?
* What effects does this change have?

8.Push the branch:

$ git push origin HEAD
 (note HEAD refers to your current branch; so make sure you're on the right branch!)

9. Test your changes:

$ docker-compose exec web make test

10. Go to [https://github.com/internetarchive/openlibrary/pulls](https://github.com/internetarchive/openlibrary/pulls) and make new pull-request from branch in your forked repository and provide the information requested in the template.
![GitHub pull request](https://archive.org/download/screenshot20191211at11.12.56/pull-request.png)

11. Your code is now ready for review!


