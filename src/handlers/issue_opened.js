import { OpenerIsMaintainer, issueOpener } from "../helpers/issue_opener.js";

export default async function issueOpenerHandler() {
  const issue_opener_username = this.issue.user.login;

  // To know who is the issue opener
  const issue_opener = issueOpener(
    this.config,
    this.maintainers,
    issue_opener_username
  );

  // Skip
  if (issue_opener === OpenerIsMaintainer.SKIP) return;

  // If issue opener is maintainer, bot comments to instruct other contributors
  // Otherwise, greets the user who opened the issue
  await this.context.octokit.issues.createComment(
    this.context.issue({
      body:
        (issue_opener === OpenerIsMaintainer.NO
          ? `@${issue_opener_username} `
          : "") + this.config[issue_opener],
    })
  );
}
