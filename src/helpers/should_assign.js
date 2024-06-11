export const Assignment = Object.freeze({
  ALREADY: "issue-already-assigned",
  MAX_ASSIGNEES: "max-assignees",
  MAX_ISSUES: "max-issues-for-user",
  MAX_ASSIGNEES_COMMENT: "max-assignees-reached",
  ASSIGN_COMMENT: "assigned-comment",
  ASSIGN: "ASSIGN",
  SKIP: "Skip",
});

export function shouldAssign(commenter, assignees, numAssignedIssues, config) {
  if (assignees.includes(commenter)) {
    if (config[Assignment.ALREADY]) return Assignment.ALREADY;
    else return Assignment.SKIP;
  }

  if (
    Assignment.MAX_ASSIGNEES in config &&
    assignees.length >= Number(config[Assignment.MAX_ASSIGNEES])
  ) {
    if (config[Assignment.MAX_ASSIGNEES_COMMENT])
      return Assignment.MAX_ASSIGNEES_COMMENT;
    else return Assignment.SKIP;
  }

  if (
    Assignment.MAX_ISSUES in config &&
    numAssignedIssues >= Number(config[Assignment.MAX_ISSUES])
  )
    return Assignment.MAX_ISSUES;

  if (config[Assignment.ASSIGN_COMMENT]) return Assignment.ASSIGN_COMMENT;

  return Assignment.ASSIGN;
}
