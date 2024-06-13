// Helper function to retrieve assigned issues
export default async function getAssignedIssues(context, username) {
  try {
    const response = await context.octokit.issues.listForRepo(
      context.repo({
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
