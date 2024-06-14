// Keys are enums, values denote the keys that are defined in config file
export const UnAssignment = Object.freeze({
  ALREADY: "issue-was-not-assigned",
  UNASSIGN_COMMENT: "unassigned-comment",
  UNASSIGN: "UNASSIGN",
  SKIP: "Skip",
});

export function shouldUnAssign(commenter, assignees, config) {
  // If issue was not assigned to the commenter already, return.
  if (!assignees.includes(commenter)) {
    if (config[UnAssignment.ALREADY]) return UnAssignment.ALREADY;
    else return UnAssignment.SKIP;
  }

  // If issue was assigned to the commenter, unassign.
  else {
    if (config[UnAssignment.UNASSIGN_COMMENT])
      return UnAssignment.UNASSIGN_COMMENT;
    return UnAssignment.UNASSIGN;
  }
}
