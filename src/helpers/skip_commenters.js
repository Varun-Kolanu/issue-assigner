export function skipCommenters(commenter, collaborators) {
  // Skip if bot commented
  if (commenter.includes("[bot]")) return true;

  // Skip if a collaborator comments
  if (collaborators.includes(commenter)) return true;

  return false;
}
