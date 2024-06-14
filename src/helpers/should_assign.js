// Keys are enums, values denote the keys that are defined in config file
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
  // If the is already assigned to the commenter return.
  if (assignees.includes(commenter)) {
    if (config[Assignment.ALREADY]) return Assignment.ALREADY;
    else return Assignment.SKIP;
  }

  // If there is feature of limiting maximum number of assignees to an issue and the current issue exceeded that limit, return.
  if (
    Assignment.MAX_ASSIGNEES in config &&
    assignees.length >= Number(config[Assignment.MAX_ASSIGNEES])
  ) {
    if (config[Assignment.MAX_ASSIGNEES_COMMENT])
      return Assignment.MAX_ASSIGNEES_COMMENT;
    else return Assignment.SKIP;
  }

  // If there is feature of limiting maximum number of assignements to a user and the current user exceeded the limit, return.
  if (
    Assignment.MAX_ISSUES in config &&
    numAssignedIssues >= Number(config[Assignment.MAX_ISSUES])
  ) {
    return Assignment.MAX_ISSUES; // Comment is fixed and not customizable, as it contains some complex string manipulation
  }

  // If everything is fine

  // If there is feature to tell the user that they got an issue assigned
  if (config[Assignment.ASSIGN_COMMENT]) return Assignment.ASSIGN_COMMENT;

  // Which means only to assign without commenting
  return Assignment.ASSIGN;
}
