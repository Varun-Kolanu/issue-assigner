import { skipCommenters } from "../helpers/skip_commenters.js";
import getAssignedIssues from "../helpers/get_assigned_issues.js";
import { issueOrIssues, thisOrThese } from "../helpers/pluralize.js";
import { getConfig } from "../utils/config.js";
import { Request, checkRequest } from "../helpers/check_request.js";
import { Assignment, shouldAssign } from "../helpers/should_assign.js";
import { UnAssignment, shouldUnAssign } from "../helpers/should_unassign.js";

export default async (context) => {
  const { issue, comment } = context.payload;
  const commenter = comment.user.login;
  const collaboratorsJson = await context.octokit.repos.listCollaborators(
    context.repo({})
  );
  const collaborators = collaboratorsJson.data.map((coll) => coll.login);

  if (skipCommenters(commenter, collaborators)) return;

  const config = await getConfig(context);
  const assignPromptKey = "assign-prompt";
  const unassignPromptKey = "unassign-prompt";

  const assignees = issue.assignees.map((assigneeJson) => assigneeJson.login);
  const assigneeCount = assignees.length;

  const request = checkRequest(comment.body, config);
  if (request === Request.SKIP) return;

  if (request === Request.ASSIGN) {
    const assignedIssues = await getAssignedIssues(context, commenter);
    const numAssignedIssues = assignedIssues.length;
    const should_assign = shouldAssign(
      commenter,
      assignees,
      numAssignedIssues,
      config
    );

    if (should_assign === Assignment.SKIP) return;

    if (should_assign === Assignment.MAX_ISSUES) {
      return await context.octokit.issues.createComment(
        context.issue({
          body: `@${commenter} You already have ${thisOrThese(
            numAssignedIssues
          )} ${issueOrIssues(numAssignedIssues)} assigned: ${assignedIssues.map(
            (issue) => `[ issue#${issue.number} ](${issue.html_url})`
          )}. Abandon your existing ${issueOrIssues(
            numAssignedIssues
          )} or contact a maintainer if you want to get this issue assigned.`,
        })
      );
    }

    if (
      should_assign !== Assignment.ASSIGN &&
      should_assign !== Assignment.ASSIGN_COMMENT
    ) {
      return await context.octokit.issues.createComment(
        context.issue({
          body: `@${commenter} ` + config[should_assign],
        })
      );
    }

    // If all OK, Assign issue to user
    await context.octokit.issues.addAssignees(
      context.issue({
        assignees: [commenter],
      })
    );

    if (should_assign === Assignment.ASSIGN_COMMENT) {
      return await context.octokit.issues.createComment(
        context.issue({
          body: `@${commenter} ` + config[should_assign],
        })
      );
    }
  } else if (request === Request.UNASSIGN) {
    const should_unassign = shouldUnAssign(commenter, assignees, config);
    if (should_unassign === UnAssignment.SKIP) return;

    if (should_unassign === UnAssignment.ALREADY) {
      return await context.octokit.issues.createComment(
        context.issue({
          body: `@${commenter} ` + config[should_unassign],
        })
      );
    }

    await context.octokit.issues.removeAssignees(
      context.issue({
        assignees: [commenter],
      })
    );

    if (should_unassign === UnAssignment.UNASSIGN_COMMENT) {
      await context.octokit.issues.createComment(
        context.issue({
          body: `@${commenter} ` + config[should_unassign],
        })
      );
    }
  }
};
