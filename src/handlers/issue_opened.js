import { OpenerIsMaintainer, issueOpener } from "../helpers/issue_opener.js";
import { getConfig } from "../utils/config.js";

export default async (context) => {
  const { issue } = context.payload;
  const collaboratorsJson = await context.octokit.repos.listCollaborators(
    context.repo({})
  );
  const collaborators = collaboratorsJson.data.map((coll) => coll.login);
  const issue_opener_username = issue.user.login;

  const config = await getConfig(context);

  const issue_opener = issueOpener(
    config,
    collaborators,
    issue_opener_username
  );
  if (issue_opener === OpenerIsMaintainer.SKIP) return;
  const issueComment = context.issue({
    body: `@${issue_opener} ` + config[issue_opener],
  });
  return await context.octokit.issues.createComment(issueComment);
};
