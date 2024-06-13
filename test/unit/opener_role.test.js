import { describe, test } from "node:test";
import assert from "node:assert";
import {
  OpenerIsMaintainer,
  issueOpener,
} from "../../src/helpers/issue_opener.js";

describe("Issue Opener handler", () => {
  const maintainers = ["test-maintainer"];
  let opener;
  let config;

  test("returns maintainer if opener is a maintainer and config has comment for maintainer opened issues", () => {
    opener = "test-maintainer";
    config = {
      "issue-opener-is-maintainer": "test comment",
    };

    assert.strictEqual(
      issueOpener(config, maintainers, opener),
      OpenerIsMaintainer.YES
    );
  });

  test("returns Skip if opener is a maintainer and config doesn't have comment for maintainer opened issues", () => {
    opener = "test-maintainer";
    config = {};

    assert.strictEqual(
      issueOpener(config, maintainers, opener),
      OpenerIsMaintainer.SKIP
    );
  });

  test("returns Not maintainer if opener is not a maintainer and config has comment for non-maintainer opened issues", () => {
    opener = "test-not-maintainer";
    config = {
      "issue-opener-not-maintainer": "test comment",
    };

    assert.strictEqual(
      issueOpener(config, maintainers, opener),
      OpenerIsMaintainer.NO
    );
  });

  test("returns Skip if opener is not a maintainer and config doesn't have comment for non-maintainer opened issues", () => {
    opener = "test-not-maintainer";
    config = {};

    assert.strictEqual(
      issueOpener(config, maintainers, opener),
      OpenerIsMaintainer.SKIP
    );
  });
});
