import nock from "nock";
import payload from "./fixtures/issues.opened.json" with { type: "json" };
// import config from "./fixtures/sample-config.json" with { type: "json" };
import { describe, beforeEach, afterEach, test } from "node:test";
import assert from "node:assert";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import issue_opened from "../src/handlers/issue_opened.js";
import getProbot from "./utils/get-probot.js";

// console.log(typeof config);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const configYml = fs.readFileSync(
  path.join(__dirname, "fixtures/sample-config.yml"),
);

const buf = Buffer.from(configYml)
const encodedConfigYml = buf.toString("base64");


describe("Issue Assigner App", () => {
  let probot;

  beforeEach(async () => {
    nock.disableNetConnect();
    probot = await getProbot();
  });

  test("creates a comment when an issue is opened", async () => {
    const mock = nock("https://api.github.com")

      // Test that access token is requested
      .post("/app/installations/2/access_tokens")
      .reply(200, {
        token: "test"
      })

      // Test that collaborators are fetched
      .get("/repos/test-owner/test-repo/collaborators")
      .reply(200, 
        [
          {
            "login": "test-owner",
          }
        ]
      )

      // Test that config is loaded
      .get("/repos/test-owner/test-repo/contents/.github\%2Fissue-assigner.yml")
      .reply(200, {
        type: 'file',
        encoding: 'base64',
        size: encodedConfigYml.length,
        name: 'issue-assigner.yml',
        path: '.github/contents/.github/issue-assigner.yml',
        content: encodedConfigYml
      })

    // Receive a webhook event
    await probot.receive({ name: "issues", payload });

  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });
});
