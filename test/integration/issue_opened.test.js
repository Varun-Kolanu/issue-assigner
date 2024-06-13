import nock from "nock";
import { describe, beforeEach, afterEach, test } from "node:test";
import assert from "node:assert";

import getProbotConfig from "../utils/get-probot.js";
import { setupNock } from "../utils/setupNocks.js";
import { createPayloadIssueOpened } from "../utils/createPayload.js";

describe("Issue Opened handler", () => {
  let probot;
  let server;
  let mock;

  beforeEach(async () => {
    nock.disableNetConnect();
    server = await getProbotConfig();
    probot = server.probotApp;
  });

  test("comments on an issue when opened by a maintainer", async () => {
    mock = setupNock(
      "Comment '@issue-assigner claim' to get this issue assigned or '@issue-assigner abandon' to get this issue unassigned."
    );

    await probot.receive({
      name: "issues",
      payload: createPayloadIssueOpened("test-maintainer"),
    });
    assert.deepStrictEqual(mock.activeMocks(), []);
  });

  test("comments on an issue when opened by a non maintainer", async () => {
    mock = setupNock(
      "@test-opener Thank you for opening this issue. Maintainers will check and approve if seems to be useful."
    );

    await probot.receive({
      name: "issues",
      payload: createPayloadIssueOpened("test-opener"),
    });
  });

  afterEach(() => {
    assert.deepStrictEqual(mock.activeMocks(), []);
    nock.cleanAll();
    nock.enableNetConnect();
  });
});
