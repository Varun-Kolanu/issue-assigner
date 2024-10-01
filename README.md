# GitHub Issue Assigner Bot

This GitHub bot helps manage issue assignments in a repository by automatically assigning or unassigning issues based on predefined rules and user commands in comments. The bot is implemented using Probot, a framework for building GitHub Apps.

If you find this project helpful, please consider giving it a star ⭐ on GitHub. It helps others discover the project and shows your appreciation for the work!

See probot published app [here](https://probot.github.io/apps/issue-assigner/), live listing on GitHub Marketplace [here](https://github.com/marketplace/issue-assigner), medium article [here](https://medium.com/@Varun-Kolanu/issue-assigner-a-github-bot-built-using-probot-fa2d11f78e98)

To join the discord server for general discussions and doubts follow the link in [this](https://github.com/Varun-Kolanu/issue-assigner/discussions/5) discussion.

## Contributing

See [Contributing guide][contributing] for contributing to the project.

# Features

- **Automatic Assignment:** Users can request assignment to an issue by commenting with a specific command.
- **Limit Assignees:** Configure maximum number of assignees allowed per issue.
- **Limit Assigned Issues:** Set a limit on the number of issues a user can be assigned to at a time in the repository.
- **Automatic unassignment:** Users can request unassignment to an issue by commenting with a specific command.
- **Issue opened comments:** Bot greets the user when issue is opened.
- **Customizable Responses:** Customize the bot's responses and prompts using a YAML configuration file.
- **Tests:** The code has robust unit and integration tests.
- **Object Oriented:** OOPS concepts like Inheritance, Polymorphism are used wherever necessary.

## Note for maintainers:

Assignment and Abandoning of issues doesn't work for users having permissions admin, maintainer or triage, since they already can assign themselves and also to avoid accidental assignment of the issue while explaining a contributor how to claim.

# Usage

1. [Install](https://github.com/apps/issue-assigner/installations/new) the bot in your account.
2. After installing the bot, create a file `.github/issue-assigner.yml` in the repo and paste the following content:

   ```yml
   # Remove or comment the line from yml if you don't need that feature

   # The name of bot you would like to be mentioned by users. {name} will be replaced by the below name
   name: "issue-assigner"

   ######################## Issue assignment ########################

   # Prompt entered by user to request assign the issue to him/her
   assign-prompt: "@{name} claim" # For example, @issue-assigner claim

   # Comment from bot if the issue got already assigned to the user requesting
   issue-already-assigned: "You have already been assigned to this issue."

   # Maximum number of assignees for an issue
   max-assignees: 1

   # Maximum number of assignees reached for the requested issue
   max-assignees-reached: "Sorry, maximum limit for assignees in this issue has reached. Please check other issues or contact a maintainer."

   # Maximum number of open issues a user can have assigned at a time in the repo
   max-issues-for-user: 1

   # If all OK, the comment from bot to tell that issue got assigned
   assigned-comment: "This issue has been successfully assigned to you! 🚀"

   ######################## Issue un-assignment ########################

   # Prompt entered by user to request un-assignment of the issue to him/her
   unassign-prompt: "@{name} abandon"

   # If the issue was already not assigned to the user
   issue-was-not-assigned: "You were not assigned to this issue."

   # If criteria is matched, the issue will get un-assigned
   unassigned-comment: "You have been unassigned to this issue successfully."

   ######################## Issue Opened ########################

   # If the user who opened issue is NOT a maintainer of the repo
   issue-opener-not-maintainer: "Thank you for opening this issue. Maintainers will check and approve if seems to be useful."

   # If the user who opened issue IS a maintainer of the repo
   issue-opener-is-maintainer: "Comment '@{name} claim' to get this issue assigned or '@{name} abandon' to get this issue unassigned."
   ```
3. You can remove a line from yml if you don't need that feature.
4. You can edit the values in the yml to customize the comments from the bot.
5. For example, commenting '@issue-asigner claim' will assign the issue and '@issue-assigner abandon' will remove the assignment.

See these issues for seeing all features practically: [#3](https://github.com/Varun-Kolanu/issue-assigner/issues/3) and [#4](https://github.com/Varun-Kolanu/issue-assigner/issues/4)

# Folder structure

```bash
.
├── .github/                          ## configuration files
│ └── issue-assigner.yml
├── assets/                           ## assets like images, icons, etc
├── src/                              ## main source code
│ ├── classes/                        # classes for event handlers defined
│ ├── handlers/                       # functions to handle webhook events from github
│ │ ├── issue_comment.js
│ │ └── issue_opened.js
│ ├── helpers/                        # utility functions to help handlers
│ ├── app.js                          # main file which exports probot app
│ └── server.js                       # server for the app
├── test/                             ## tests for app
│ ├── fixtures/                       # mock data for testing
│ ├── integration/                    # integration tests
│ ├── unit/                           # unit tests
│ └── utils/                          # utility functions for tests
├── CONTRIBUTING.md                   ## Contributing Guide
└── README.md                         ## Readme
```

# License

[ISC][license] © 2024 Varun Kolanu

[contributing]: /CONTRIBUTING.md
[usage]: /README.md#usage
[license]: /LICENSE
