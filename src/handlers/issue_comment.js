import { skipCommenters } from "../helpers/skip_commenters.js";
import getAssignedIssues from "../helpers/get_assigned_issues.js";
import { issueOrIssues, thisOrThese } from "../helpers/pluralize.js";
import { Request, checkRequest } from "../helpers/check_request.js";
import { Assignment, shouldAssign } from "../helpers/should_assign.js";
import { UnAssignment, shouldUnAssign } from "../helpers/should_unassign.js";

export default async function issueCommentHandler() {
  // Fetching comment
  const { comment, repository } = this.context.payload;
  const commenter = comment.user.login;

  // If repository is pubic and commenter is bot or maintainer.
  if (!repository.private && skipCommenters(commenter, this.maintainers)) return;

  // Get assignees of the issue
  const assignees = this.issue.assignees.map(
    (assigneeJson) => assigneeJson.login
  );

  // Check what the commenter is requesting
  const request = checkRequest(comment.body, this.config);

  if (request === Request.SKIP) return;

  if (request === Request.ASSIGN) {
    // Get already assigned issues in the repo of the user requesting
    const assignedIssues = await getAssignedIssues(this.context, commenter);
    const numAssignedIssues = assignedIssues.length;

    // should_assign contains the key to be used in the config file.
    const should_assign = shouldAssign(
      commenter,
      assignees,
      numAssignedIssues,
      this.config
    );

    if (should_assign === Assignment.SKIP) return;

    if (should_assign === Assignment.MAX_ISSUES) {
      // If maximum number of issues of issues for a user reached.
      return await this.context.octokit.issues.createComment(
        this.context.issue({
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
      return await this.context.octokit.issues.createComment(
        this.context.issue({
          body: `@${commenter} ` + this.config[should_assign],
        })
      );
    }

    // If all OK, Assign issue to user
    await this.context.octokit.issues.addAssignees(
      this.context.issue({
        assignees: [commenter],
      })
    );

    // Tell the user that they got issue assigned successfully
    if (should_assign === Assignment.ASSIGN_COMMENT) {
      return await this.context.octokit.issues.createComment(
        this.context.issue({
          body: `@${commenter} ` + this.config[should_assign],
        })
      );
    }
  }

  // Request for unassignment of issue
  else if (request === Request.UNASSIGN) {
    const should_unassign = shouldUnAssign(commenter, assignees, this.config);
    if (should_unassign === UnAssignment.SKIP) return;

    if (should_unassign === UnAssignment.ALREADY) {
      // Issue was already not assigned.
      return await this.context.octokit.issues.createComment(
        this.context.issue({
          body: `@${commenter} ` + this.config[should_unassign],
        })
      );
    }

    // If OK, remove the assignee requesting.
    await this.context.octokit.issues.removeAssignees(
      this.context.issue({
        assignees: [commenter],
      })
    );

    if (should_unassign === UnAssignment.UNASSIGN_COMMENT) {
      await this.context.octokit.issues.createComment(
        this.context.issue({
          body: `@${commenter} ` + this.config[should_unassign],
        })
      );
    }
  }
}
