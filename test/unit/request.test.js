import { describe, test } from "node:test";
import assert from "node:assert";
import { Request, checkRequest } from "../../src/helpers/check_request.js";

describe("Check Request Functionality", () => {
  let config1;
  let config2;
  let comments;
  test("identifies comments requesting assignment correctly", () => {
    config1 = {
      "assign-prompt": "claim",
    };
    config2 = {};
    comments = ["Issue claim", "Claim", "CLaIm"];
    comments.forEach((comment) => {
      assert.strictEqual(checkRequest(comment, config1), Request.ASSIGN);
      assert.strictEqual(checkRequest(comment, config2), Request.SKIP);
    });
  });

  test("identifies comments requesting unassignment correctly", () => {
    config1 = {
      "unassign-prompt": "abandon",
    };
    config2 = {};
    comments = ["Issue abandon", "Hey bot please AbAndon"];
    comments.forEach((comment) => {
      assert.strictEqual(checkRequest(comment, config1), Request.UNASSIGN);
      assert.strictEqual(checkRequest(comment, config2), Request.SKIP);
    });
  });

  test("skips comments not related to assignment or unassignment", () => {
    config1 = {
      "assign-prompt": "claim",
      "unassign-prompt": "abandon",
    };
    comments = ["Some random", "Test comment"];
    comments.forEach((comment) => {
      assert.strictEqual(checkRequest(comment, config1), Request.SKIP);
    });
  });
});
