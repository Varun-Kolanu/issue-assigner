export function skipCommenters(commenter, maintainers) {
  // Skip if bot commented
  if (commenter.includes("[bot]")) return true;

  // Skip if a maintainer comments so that maintainer shall not accidentally assign themselves while explaining to the users
  if (maintainers.includes(commenter)) return true;

  return false;
}
