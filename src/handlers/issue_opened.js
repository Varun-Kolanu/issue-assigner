import { getConfig } from "../utils/config.js";

export default async (context) => {
  const { issue } = context.payload;
  const collaborators = (
    await context.octokit.repos.listCollaborators(context.issue({}))
  ).data.map((coll) => coll.login);
  const issue_opener = issue.user.login;

  const config = await getConfig(context);
  const issueOpenerNotMaintainer = "issue-opener-not-maintainer";
  const issueOpenerIsMaintainer = "issue-opener-is-maintainer";

  // Issue opener is not a maintainer
  if (
    issueOpenerNotMaintainer in config &&
    !collaborators.includes(issue_opener)
  ) {
    const issueComment = context.issue({
      body: `@${issue_opener} ` + config[issueOpenerNotMaintainer],
    });
    return await context.octokit.issues.createComment(issueComment);
  }

  // Issue opener is a maintainer
  if (
    issueOpenerIsMaintainer in config &&
    collaborators.includes(issue_opener)
  ) {
    const issueComment = context.issue({
      body: config[issueOpenerIsMaintainer],
    });
    return await context.octokit.issues.createComment(issueComment);
  }
};
