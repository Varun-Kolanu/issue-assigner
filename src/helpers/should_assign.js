export const Assignment = Object.freeze({
  ALREADY: "issue-already-assigned",
  MAX_ASSIGNEES: "max-assignees-reached",
  MAX_ISSUES: "max-issues-for-user",
  ASSIGN_COMMENT: "assigned-comment",
  ASSIGN,
  SKIP: "Skip",
});

export function shouldAssign(commenter, assignees, numAssignedIssues, config) {
  if (assignees.includes(commenter)) {
    if (config[Assignment.ALREADY]) return Assignment.ALREADY;
    else return Assignment.SKIP;
  }

  if (
    Assignment.MAX_ASSIGNEES in config &&
    assignees.length > Number(config[Assignment.MAX_ASSIGNEES])
  )
    return Assignment.MAX_ASSIGNEES;

  if (
    Assignment.MAX_ISSUES in config &&
    numAssignedIssues > Number(config[Assignment.MAX_ISSUES])
  )
    return Assignment.MAX_ASSIGNEES;

  if (config[Assignment.ASSIGN_COMMENT]) return Assignment.ASSIGN_COMMENT;

  return Assignment.ASSIGN;
}
