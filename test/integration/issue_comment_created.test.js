import nock from "nock";
import { describe, beforeEach, afterEach, test } from "node:test";
import assert from "node:assert";

import getProbotConfig from "../utils/get-probot.js";
import { setupNock, setupNockSkip } from "../utils/setupNocks.js";
import { createPayloadIssueComment } from "../utils/createPayload.js";

describe("Issue Comment Created handler", () => {
  let probot;
  let server;
  let mock;

  beforeEach(async () => {
    nock.disableNetConnect();
    server = await getProbotConfig();
    probot = server.probotApp;
  });

  test("only fetches until collaborators and returns if commenter is a bot", async () => {
    mock = setupNockSkip();

    await probot.receive({
      name: "issue_comment",
      payload: createPayloadIssueComment("issue-assigner[bot]"),
    });
  });

  test("only fetches until collaborators and returns if commenter is a maintainer", async () => {
    mock = setupNockSkip();

    await probot.receive({
      name: "issue_comment",
      payload: createPayloadIssueComment("test-maintainer"),
    });
  });

  test("assigns an issue if requested to assign and all OK!", async () => {
    mock = setupNock(
      "@test-commenter This issue has been successfully assigned to you! 🚀"
    )
      // Fetch already assigned issues
      .get(
        "/repos/test-owner/test-repo/issues?assignee=test-commenter&state=open"
      )
      .reply(200, [])

      // Assign issue
      .post("/repos/test-owner/test-repo/issues/1/assignees", (body) => {
        assert.deepStrictEqual(body, {
          assignees: ["test-commenter"],
        });
        return true;
      })
      .reply(200);

    await probot.receive({
      name: "issue_comment",
      payload: createPayloadIssueComment(
        "test-commenter",
        "@issue-assigner claim"
      ),
    });
  });

  describe("Doesn't assign the issue if requested to assign and if ", () => {
    test("that issue is already assigned to the commeneter", async () => {
      mock = setupNock(
        "@assignee1 You have already been assigned to this issue."
      )
        // Fetch already assigned issues
        .get("/repos/test-owner/test-repo/issues?assignee=assignee1&state=open")
        .reply(200, [
          {
            number: 1,
            html_url: "sampleurl",
          },
        ]);

      await probot.receive({
        name: "issue_comment",
        payload: createPayloadIssueComment(
          "assignee1",
          "@issue-assigner claim",
          true
        ),
      });
    });

    test("max assignees reached in issue", async () => {
      mock = setupNock(
        "@test-commenter Sorry, maximum limit for assignees in this issue has reached. Please check other issues or contact a maintainer."
      )
        // Fetch already assigned issues
        .get(
          "/repos/test-owner/test-repo/issues?assignee=test-commenter&state=open"
        )
        .reply(200, []);

      await probot.receive({
        name: "issue_comment",
        payload: createPayloadIssueComment(
          "test-commenter",
          "@issue-assigner claim",
          true
        ),
      });
    });

    test("max issues for user reached in repo", async () => {
      mock = setupNock(
        "@test-commenter You already have this issue assigned: [ issue#2 ](sample-url). Abandon your existing issue or contact a maintainer if you want to get this issue assigned."
      )
        // Fetch already assigned issues
        .get(
          "/repos/test-owner/test-repo/issues?assignee=test-commenter&state=open"
        )
        .reply(200, [
          {
            number: 2,
            html_url: "sample-url",
          },
        ]);

      await probot.receive({
        name: "issue_comment",
        payload: createPayloadIssueComment(
          "test-commenter",
          "@issue-assigner claim"
        ),
      });
    });
  });

  test("unassigns an issue if requested to unassign and all OK!", async () => {
    mock = setupNock(
      "@assignee1 You have been unassigned to this issue successfully."
    )
      // Unassign the issue
      .delete("/repos/test-owner/test-repo/issues/1/assignees", (body) => {
        assert.deepStrictEqual(body, { assignees: ["assignee1"] });
        return true;
      })
      .reply(201);

    await probot.receive({
      name: "issue_comment",
      payload: createPayloadIssueComment(
        "assignee1",
        "@issue-assigner abandon",
        true
      ),
    });
  });

  test("doesn't unassign an issue if requested to unassign and already not assigned", async () => {
    mock = setupNock("@test-commenter You were not assigned to this issue.");

    await probot.receive({
      name: "issue_comment",
      payload: createPayloadIssueComment(
        "test-commenter",
        "@issue-assigner abandon",
        true
      ),
    });
  });

  afterEach(() => {
    assert.deepStrictEqual(mock.activeMocks(), []);
    nock.cleanAll();
    nock.enableNetConnect();
  });
});
