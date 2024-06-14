// Keys are enums, values denote the keys that are defined in config file
export const OpenerIsMaintainer = Object.freeze({
  YES: "issue-opener-is-maintainer",
  NO: "issue-opener-not-maintainer",
  SKIP: "Skip",
});

export const issueOpener = (config, maintainers, issue_opener_username) => {
  // Issue opener is maintainer
  if (maintainers.includes(issue_opener_username)) {
    // If feature exists for commenting on issues opened by maintainer in config
    return config[OpenerIsMaintainer.YES]
      ? OpenerIsMaintainer.YES
      : OpenerIsMaintainer.SKIP;
  }

  // Issue opener is not a maintainer
  else {
    // If feature exists for commenting on issues opened by non-maintainer in config
    return config[OpenerIsMaintainer.NO]
      ? OpenerIsMaintainer.NO
      : OpenerIsMaintainer.SKIP;
  }
};
