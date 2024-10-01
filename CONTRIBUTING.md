## Contributing

Hi there! We're thrilled that you'd like to contribute to this project. Your help is essential for keeping it great.

Please note that this project is released with a [Contributor Code of Conduct][code-of-conduct]. By participating in this project you agree to abide by its terms.

## Prerequisites

1. Git installed
2. Node installed (Latest LTS version is preferred)

## Set up locally

Follow [this][setup] guide to setup the repo locally

To know how probot works to build GitHub apps, follow [this](https://probot.github.io/docs/) guide.

## Issues and PRs

If you have suggestions for how this project could be improved, or want to report a bug, open an issue! We'd love all and any contributions. If you have questions, too, we'd love to hear them.

We'd also love PRs. If you're thinking of a large PR, we advise opening up an issue first to talk about it, though! Look at the links below if you're not sure how to open a PR.

To get an issue assigned, use the issue-assigner bot:

1. Comment `@issue-assigner claim` to get an issue assigned.
2. Comment `@issue-assigner abandon` to get an issue unassigned.

## Submitting a pull request

1. [Setup][Setup] the repo and make sure the tests pass on your machine using: `npm test`
2. Create a new branch: `git checkout -b your-branch-name`
3. Make your change, add tests, and make sure the tests still pass.
4. Push to your fork and submit a pull request, ensuring all CI/CD tests pass.
5. The PR message should contain any of the following keywords and should contain the issue number it is solving so that it gets linked in that issue:

   ```
   close, closes, closed, fix, fixes, fixed, resolve, resolves, resolved
   ```

   Example PR message:

   ```
   This PR does this...
   fixes #1
   ```
6. Make the PR a Draft, if not ready for a review and make it Open when your PR is ready.
7. Pat your self on the back and wait for your pull request to be reviewed and merged.

Here are a few things you can do that will increase the likelihood of your pull request being accepted:

- Write and update tests.
- Keep your changes as focused as possible. If there are multiple changes you would like to make that are not dependent upon each other, consider submitting them as separate pull requests.
- Write a [good commit message](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html).

Work in Progress pull requests are also welcome to get feedback early on, or if there is something blocked you.

## Good contributing practices

1. Before making a PR, always fetch the current remote repo from github into local machine so that any code changes by other contributors are reflected:

   ```
   git fetch --all
   ```
2. Before making a PR rebase (not pull) your repo with upstream with the following command and solve any merge conflicts if exist: (To know more about rebase refer to this [video](https://youtu.be/4aIazhclURE?feature=shared) ):

   ```
   git rebase upstream/main
   ```
3. Do `git fetch --all` and `git rebase upstream/main` frequently to update the local repository.

## Hacktoberfest guidelines

1. Only claim the issues that have label `help wanted`
2. If the PR seems good, `hacktoberfest-accepted` label will be assigned, which will count as a valid contribution.
3. Please focus on quality over quantity. Though documentation changes are essential, focus more on code or testing changes.
4. Abstain from making Spam PRs, otherwise label `spam` will be applied, and hacktoberfest disqualifies a user if they receive more than 2 spam labels.
5. Let's make the OpenSource community shine and lets grow together! Happy Hacking!

## Resources

- [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)
- [Using Pull Requests](https://help.github.com/articles/about-pull-requests/)
- [GitHub Help](https://help.github.com)

[setup]: SETUP.md
[code-of-conduct]: CODE_OF_CONDUCT.md
