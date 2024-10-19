export const Request = Object.freeze({
  ASSIGN: "assign-prompt",
  UNASSIGN: "unassign-prompt",
  SKIP: "Skip",
});

export function checkRequest(comment, config) {
  comment = comment
    .replace(/\s+/g, " ") // trim whitespace
    .toLowerCase(); // Case insensitive

  if (config[Request.ASSIGN] && comment.includes(config[Request.ASSIGN].toLowerCase())) {
    return Request.ASSIGN;
  }
  if (config[Request.UNASSIGN] && comment.includes(config[Request.UNASSIGN].toLowerCase())) {
    return Request.UNASSIGN;
  }
  return Request.SKIP;
}
