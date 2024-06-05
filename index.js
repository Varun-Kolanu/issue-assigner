/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */

export default (app, { getRouter }) => {
  const router = getRouter("/");
  router.get("/", (_, res) => {
    res.send("Welcome to CSOC Bot");
  });

  app.on("issues.opened", async (context) => {
    const { issue, repository } = context.payload;
    const owner = repository.owner.login;
    const username = issue.user.login; // User who commented

    if (username !== owner) {
      const issueComment = context.issue({
        body: `Thank you @${username} for opening this issue. Maintainers will check the issue and approve if issue seems to be useful.`,
      });
      return await context.octokit.issues.createComment(issueComment);
    } else {
      const issueComment = context.issue({
        body: `Comment "@csoc-bot claim" to get this issue assigned or "@csoc-bot abandon" to get this issue unassigned`,
      });
      return await context.octokit.issues.createComment(issueComment);
    }
  });

  app.on("issue_comment.created", async (context) => {
    const { issue, repository, comment } = context.payload;
    const owner = repository.owner.login;
    const username = comment.user.login; // User who commented

    if (username.includes("csoc-bot")) return;
    if (owner === username) return;

    const assignees = issue.assignees.map((assigneeJson) => assigneeJson.login);
    const assigneeCount = assignees.length;

    // Check if the comment is requesting assignment
    const assignRequest = comment.body
      .replace(/\s+/g, " ") // trim whitespace
      .toLowerCase()
      .includes("@csoc-bot claim"); // Case-insensitive

    const unassignRequest = comment.body
      .replace(/\s+/g, " ")
      .toLowerCase()
      .includes("@csoc-bot abandon");

    if (unassignRequest) {
      if (assignees.includes(username)) {
        await context.octokit.issues.removeAssignees(
          context.issue({
            assignees: [username],
          })
        );

        await context.octokit.issues.createComment(
          context.issue({
            body: `@${username}, You have been unassigned to this issue successfully.`,
          })
        );
      } else {
        await context.octokit.issues.createComment(
          context.issue({
            body: `@${username}, You were not assigned to this issue.`,
          })
        );
      }
      return;
    }

    if (!assignRequest) {
      return; // Skip if not requesting assignment
    }

    try {
      if (assignees.includes(username)) {
        return await context.octokit.issues.createComment(
          context.issue({
            body: `@${username}, You have already been assigned to this issue.`,
          })
        );
      }

      if (assigneeCount >= 1) {
        return await context.octokit.issues.createComment(
          context.issue({
            body: `Sorry @${username}!, this issue got already assigned. Please check other issues or contact a maintainer.`,
          })
        );
      }

      // Get the user's existing assigned issues
      const assignedIssues = await getAssignedIssues(context, username);

      // Check if the user has any other assigned issues
      if (assignedIssues.length === 0) {
        await context.octokit.issues.addAssignees(
          context.issue({
            assignees: [username],
          })
        );
        return await context.octokit.issues.createComment(
          context.issue({
            body: `@${username}, This issue has been successfully assigned to you! 🚀`,
          })
        );
      } else {
        await context.octokit.issues.createComment(
          context.issue({
            body: `@${username}, you already have ${
              assignedIssues.length != 1 ? "these" : "this"
            } issue${
              assignedIssues.length != 1 ? "s" : ""
            } assigned: ${assignedIssues.map(
              (issue) => `[ issue#${issue.number} ](${issue.html_url})`
            )} .Abandon your existing issue${
              assignedIssues.length != 1 ? "s" : ""
            } or contact a maintainer if you want to get this issue assigned.`,
          })
        );
      }
    } catch (error) {
      console.error(error);
    }
  });
};

// Helper function to retrieve assigned issues
async function getAssignedIssues(context, username) {
  try {
    const response = await context.octokit.issues.listForRepo(
      context.issue({
        assignee: username,
        state: "open",
      })
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return []; // Handle errors gracefully, return empty array
  }
}
