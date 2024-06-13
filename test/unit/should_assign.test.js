import { describe, test, beforeEach } from "node:test";
import assert from "node:assert";
import { Assignment, shouldAssign } from "../../src/helpers/should_assign.js";

describe("Assignment Decision Logic", () => {
  let commenter;
  let assignees = ["assignee1"];
  let config1;
  let numAssignedIssues = 0;
  let config2 = {};

  beforeEach(() => {
    assignees = ["assignee1"];
    numAssignedIssues = 0;
  });

  test("classifies correctly if issue is already assigned", () => {
    commenter = "assignee1";
    config1 = {
      "issue-already-assigned": "test",
    };
    assert.strictEqual(
      shouldAssign(commenter, assignees, numAssignedIssues, config1),
      Assignment.ALREADY
    );
    assert.strictEqual(
      shouldAssign(commenter, assignees, numAssignedIssues, config2),
      Assignment.SKIP
    );
  });

  test("classifies correctly if Max assignees reached", () => {
    commenter = "assignee2";
    config1 = {
      "max-assignees": 1,
      "max-assignees-reached": "test",
    };
    config2 = {
      "max-assignees": 1,
    };
    assert.strictEqual(
      shouldAssign(commenter, assignees, numAssignedIssues, config1),
      Assignment.MAX_ASSIGNEES_COMMENT
    );

    assert.strictEqual(
      shouldAssign(commenter, assignees, numAssignedIssues, config2),
      Assignment.SKIP
    );
  });

  test("classifies correctly if Max issues reached", () => {
    commenter = "assignee2";
    config1 = {
      "max-issues-for-user": 1,
    };
    numAssignedIssues = 1;
    assert.strictEqual(
      shouldAssign(commenter, assignees, numAssignedIssues, config1),
      Assignment.MAX_ISSUES
    );
  });

  test("classifies correctly assignment", () => {
    commenter = "assignee2";
    assignees = [];
    config1 = {
      "assigned-comment": "test",
    };
    assert.strictEqual(
      shouldAssign(commenter, assignees, 0, config1),
      Assignment.ASSIGN_COMMENT
    );

    assert.strictEqual(
      shouldAssign(commenter, assignees, 0, config2),
      Assignment.ASSIGN
    );
  });
});
