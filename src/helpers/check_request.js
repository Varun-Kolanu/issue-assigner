export const Request = Object.freeze({
  ASSIGN: "assign-prompt",
  UNASSIGN: "unassign-prompt",
  SKIP: "Skip",
});

export function checkRequest(comment, config) {
  comment = comment
    .replace(/\s+/g, " ") // trim whitespace
    .toLowerCase(); // Case insensitive

  if (config[Request.ASSIGN]) {
    if (comment.includes(config[Request.ASSIGN])) return Request.ASSIGN;
    else return Request.SKIP;
  } else if (config[Request.UNASSIGN]) {
    if (comment.includes(config[Request.UNASSIGN])) return Request.UNASSIGN;
    else return Request.SKIP;
  } else return Request.SKIP;
}
