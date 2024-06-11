import { describe, test } from "node:test";
import assert from "node:assert";
import {
  OpenerIsMaintainer,
  issueOpener,
} from "../../src/helpers/issue_opener.js";

describe("If Issue Opener", () => {
  const collaborators = ["test-collaborator"];
  let opener;
  let config;

  test("is collaborator and comment for maintainer opened issues enabled", () => {
    opener = "test-collaborator";
    config = {
      "issue-opener-is-maintainer": "test comment",
    };

    assert.strictEqual(
      issueOpener(config, collaborators, opener),
      OpenerIsMaintainer.YES
    );
  });

  test("is collaborator and comment for maintainer opened issues not enabled", () => {
    opener = "test-collaborator";
    config = {};

    assert.strictEqual(
      issueOpener(config, collaborators, opener),
      OpenerIsMaintainer.SKIP
    );
  });

  test("is not collaborator and comment for non-maintainer opened issues enabled", () => {
    opener = "test-not-collaborator";
    config = {
      "issue-opener-not-maintainer": "test comment",
    };

    assert.strictEqual(
      issueOpener(config, collaborators, opener),
      OpenerIsMaintainer.NO
    );
  });

  test("is not collaborator and comment for non-maintainer opened issues not enabled", () => {
    opener = "test-not-collaborator";
    config = {};

    assert.strictEqual(
      issueOpener(config, collaborators, opener),
      OpenerIsMaintainer.SKIP
    );
  });
});
