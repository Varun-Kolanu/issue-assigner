import getAssignedIssues from "../helpers/get_assigned_issues.js";
import { issueOrIssues, thisOrThese } from "../helpers/pluralize.js";
import { getConfig } from "../utils/config.js";

export default async (context) => {
  const { issue, comment } = context.payload;
  const commenter = comment.user.login;
  const collaborators = (
    await context.octokit.repos.listCollaborators(context.issue({}))
  ).data.map((coll) => coll.login);

  if (commenter.includes("[bot]")) return;
  if (collaborators.includes(commenter)) return;

  const config = await getConfig(context);
  const assignPromptKey = "assign-prompt";
  const unassignPromptKey = "unassign-prompt";

  const assignees = issue.assignees.map((assigneeJson) => assigneeJson.login);
  const assigneeCount = assignees.length;

  // Feature: Self assigning an issue is present
  if (assignPromptKey in config) {
    // Check if the user is requesting assignment
    const assignRequest = comment.body
      .replace(/\s+/g, " ") // trim whitespace
      .toLowerCase() // Case-insensitive
      .includes(config[assignPromptKey]);

    // User is requesting assignment
    if (assignRequest) {
      const issueAlreadyAssignedKey = "issue-already-assigned";
      // The issue is already assigned to the user requesting
      if (issueAlreadyAssignedKey in config && assignees.includes(commenter)) {
        return await context.octokit.issues.createComment(
          context.issue({
            body: `@${commenter} ` + config[issueAlreadyAssignedKey],
          })
        );
      }

      const maxAssigneesKey = "max-assignees";
      // Maximum number of assignments to issue reached
      if (maxAssigneesKey in config) {
        if (assigneeCount >= config[maxAssigneesKey]) {
          const maxAssigneesReachedKey = "max-assignees-reached";
          return await context.octokit.issues.createComment(
            context.issue({
              body: `@${commenter} ` + config[maxAssigneesReachedKey],
            })
          );
        }
      }

      // Get the user's existing assigned issues
      const assignedIssues = await getAssignedIssues(context, commenter);
      const numAssignedIssues = assignedIssues.length;

      const maxIssuesForUserKey = "max-issues-for-user";
      // Maximum number of assigned issues at a time for the user reached
      if (
        maxIssuesForUserKey in config &&
        numAssignedIssues >= config[maxIssuesForUserKey]
      ) {
        return await context.octokit.issues.createComment(
          context.issue({
            body: `@${commenter} You already have ${thisOrThese(
              numAssignedIssues
            )} ${issueOrIssues(
              numAssignedIssues
            )} assigned: ${assignedIssues.map(
              (issue) => `[ issue#${issue.number} ](${issue.html_url})`
            )}. Abandon your existing ${issueOrIssues(
              numAssignedIssues
            )} or contact a maintainer if you want to get this issue assigned.`,
          })
        );
      }

      // If all OK, Assign issue to user
      await context.octokit.issues.addAssignees(
        context.issue({
          assignees: [commenter],
        })
      );

      // Bot comments that issue has been assigned
      const assignedSuccessKey = "assigned-comment";
      if (assignedSuccessKey in config) {
        return await context.octokit.issues.createComment(
          context.issue({
            body: `@${commenter} ` + config[assignedSuccessKey],
          })
        );
      }
    }
  }

  // Feature: Self un-assigning an issue is present
  if (unassignPromptKey in config) {
    // Check if the user is requesting to un-assign
    const unassignRequest = comment.body
      .replace(/\s+/g, " ")
      .toLowerCase()
      .includes(config[unassignPromptKey]);

    // User is requesting to unassign
    if (unassignRequest) {
      if (assignees.includes(commenter)) {
        await context.octokit.issues.removeAssignees(
          context.issue({
            assignees: [commenter],
          })
        );

        const unassignedPromptKey = "unassigned-comment";
        if (unassignedPromptKey in config) {
          await context.octokit.issues.createComment(
            context.issue({
              body: `@${commenter} ` + config[unassignedPromptKey],
            })
          );
        }
      } else {
        // The issue was not assigned to user already
        const issueWasNotAssignedKey = "issue-was-not-assigned";
        if (issueWasNotAssignedKey in config) {
          await context.octokit.issues.createComment(
            context.issue({
              body: `@${commenter} ` + config[issueWasNotAssignedKey],
            })
          );
        }
      }
      return;
    }
  }
};
