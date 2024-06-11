import { Probot, ProbotOctokit } from "probot";
import fs from "fs";
import myProbotApp from "../../src/app.js";
import path from "path";
import { fileURLToPath } from "url";

export default async function getProbot() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const privateKey = fs.readFileSync(
    path.join(__dirname, "../fixtures/mock-cert.pem"),
    "utf-8"
  );

  const probot = new Probot({
    appId: 123,
    privateKey,
    // disable request throttling and retries for testing
    Octokit: ProbotOctokit.defaults({
      retry: { enabled: false },
      throttle: { enabled: false },
    }),
  });

  // Load our app into probot
  await probot.load(myProbotApp);
  return probot;
}
