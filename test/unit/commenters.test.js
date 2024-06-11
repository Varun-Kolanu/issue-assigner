import { describe, test } from "node:test";
import assert from "node:assert";
import { skipCommenters } from "../../src/helpers/skip_commenters.js";

describe("If Commenter", () => {
  let collaborators = ["test-collaborator"];
  test("is a bot, skip", () => {
    ["issue-assigner[bot]", "test [bot]"].forEach((username) => {
      assert.strictEqual(skipCommenters(username, collaborators), true);
    });

    assert.strictEqual(skipCommenters("normal-user", collaborators), false);
  });

  test("is a collaborator, skip", () => {
    assert.strictEqual(
      skipCommenters("test-collaborator", collaborators),
      true
    );

    assert.strictEqual(
      skipCommenters("test-not-collaborator", collaborators),
      false
    );
  });
});
