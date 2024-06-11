import { Probot, ProbotOctokit, Server } from "probot";
import fs from "fs";
import myProbotApp from "../../src/app.js";
import path from "path";
import { fileURLToPath } from "url";

export default async function getProbotConfig() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const privateKey = fs.readFileSync(
    path.join(__dirname, "../fixtures/mock-cert.pem"),
    "utf-8"
  );

  const probot = Probot.defaults({
    appId: 123,
    privateKey,
    secret: "secret",
    // disable request throttling and retries for testing
    Octokit: ProbotOctokit.defaults({
      retry: { enabled: false },
      throttle: { enabled: false },
    }),
  });

  const server = new Server({ Probot: probot });
  // Load our app into probot
  await server.load(myProbotApp);
  return server;
}
