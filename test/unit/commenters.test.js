import { describe, test } from "node:test";
import assert from "node:assert";
import { skipCommenters } from "../../src/helpers/skip_commenters.js";

describe("Skip Commenters", () => {
  let maintainers = ["test-maintainer"];
  test("if commenter is a bot", () => {
    ["issue-assigner[bot]", "test [bot]"].forEach((username) => {
      assert.strictEqual(skipCommenters(username, maintainers), true);
    });

    assert.strictEqual(skipCommenters("normal-user", maintainers), false);
  });

  test("if commenter is a maintainer", () => {
    assert.strictEqual(skipCommenters("test-maintainer", maintainers), true);

    assert.strictEqual(
      skipCommenters("test-not-maintainer", maintainers),
      false
    );
  });
});
