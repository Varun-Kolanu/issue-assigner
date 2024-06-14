import nock from "nock";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import assert from "node:assert";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const configYmlPath = path.join(__dirname, "../fixtures/sample-config.yml");
const configYml = fs.readFileSync(configYmlPath, "utf-8");

export const setupNock = (commentBody) => {
  return setupNockSkip()
    .post("/repos/test-owner/test-repo/issues/1/comments", (body) => {
      assert.deepStrictEqual(body, { body: commentBody });
      return true;
    })
    .reply(200);
};

export const setupNockSkip = () => {
  return nock("https://api.github.com")
    .post("/app/installations/2/access_tokens")
    .reply(200, { token: "test" })
    .get("/repos/test-owner/test-repo/collaborators")
    .reply(200, [{ login: "test-maintainer", permissions: { maintain: true } }])
    .get("/repos/test-owner/test-repo/contents/.github%2Fissue-assigner.yml")
    .reply(200, configYml);
};

// export const setupNockAssigned = (commentBody) => {
//   return setupNock(commentBody)
// };
