export const UnAssignment = Object.freeze({
  ALREADY: "issue-was-not-assigned",
  UNASSIGN_COMMENT: "unassigned-comment",
  UNASSIGN: "UNASSIGN",
  SKIP: "Skip",
});

export function shouldUnAssign(commenter, assignees, config) {
  if (!assignees.includes(commenter)) {
    if (config[UnAssignment.ALREADY]) return UnAssignment.ALREADY;
    else return UnAssignment.SKIP;
  } else {
    if (config[UnAssignment.UNASSIGN_COMMENT])
      return UnAssignment.UNASSIGN_COMMENT;
    return UnAssignment.UNASSIGN;
  }
}
