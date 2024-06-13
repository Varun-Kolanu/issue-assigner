import { describe, test } from "node:test";
import assert from "node:assert";
import {
  UnAssignment,
  shouldUnAssign,
} from "../../src/helpers/should_unassign.js";

describe("Unassignment Decision Logic", () => {
  let commenter;
  const assignees = ["assignee1"];
  let config1;
  const config2 = {};
  test("classifies correctly if Requester was already not assigned", () => {
    commenter = "assignee2";
    config1 = {
      "issue-was-not-assigned": "test",
    };
    assert.strictEqual(
      shouldUnAssign(commenter, assignees, config1),
      UnAssignment.ALREADY
    );
    assert.strictEqual(
      shouldUnAssign(commenter, assignees, config2),
      UnAssignment.SKIP
    );
  });

  test("classifies correctly if Requester was assigned and says to unassign", () => {
    commenter = "assignee1";
    config1 = {
      "unassigned-comment": "test",
    };
    assert.strictEqual(
      shouldUnAssign(commenter, assignees, config1),
      UnAssignment.UNASSIGN_COMMENT
    );
    assert.strictEqual(
      shouldUnAssign(commenter, assignees, config2),
      UnAssignment.UNASSIGN
    );
  });
});
