export const OpenerIsMaintainer = Object.freeze({
  YES: "issue-opener-is-maintainer",
  NO: "issue-opener-not-maintainer",
  SKIP: "Skip",
});

export const issueOpener = (config, collaborators, issue_opener_username) => {
  if (collaborators.includes(issue_opener_username)) {
    return config[OpenerIsMaintainer.YES]
      ? OpenerIsMaintainer.YES
      : OpenerIsMaintainer.SKIP;
  } else {
    return config[OpenerIsMaintainer.NO]
      ? OpenerIsMaintainer.NO
      : OpenerIsMaintainer.SKIP;
  }
};
