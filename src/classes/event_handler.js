import issueCommentHandler from "../handlers/issue_comment.js";
import issueOpenerHandler from "../handlers/issue_opened.js";
import { getConfig } from "../helpers/config.js";

// Event handler for webhook events
class EventHandler {
  // context contains the information of repo
  constructor(context) {
    this.context = context;
  }

  async init() {
    // catching issue from the payload of webhook
    const { issue } = this.context.payload;

    // Fetching maintainers of the repository to be used later
    const collaboratorsJson =
      await this.context.octokit.repos.listCollaborators(this.context.repo({}));
    const maintainers = collaboratorsJson.data
      .filter((coll) => {
        return (
          coll.permissions.admin ||
          coll.permissions.maintain ||
          coll.permissions.triage
        );
      })
      .map((coll) => coll.login);

    // Fetching config, like yml from `.github` folder of repo.
    const config = await getConfig(this.context);

    // Saving
    this.issue = issue;
    this.maintainers = maintainers;
    this.config = config;
  }

  handleEvent() {
    throw new Error("handleEvent method must be implemented");
  }
}

// Inheriting EventHandler
export class IssueCommentHandler extends EventHandler {
  // Override
  async handleEvent() {
    await this.init();
    await issueCommentHandler.call(this);
  }
}

// Inheriting EventHandler
export class IssueOpenerHandler extends EventHandler {
  // Override
  async handleEvent() {
    await this.init();
    await issueOpenerHandler.call(this);
  }
}
