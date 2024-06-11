import { Probot, Server, run } from "probot";
import app from "./app.js";
import bodyParser from "body-parser";
import { configDotenv } from "dotenv";
configDotenv({});

// async function startServer() {
//   const server = new Server({
//     Probot: Probot.defaults({
//       appId: process.env.APP_ID,
//       privateKey: process.env.PRIVATE_KEY,
//       secret: process.env.WEBHOOK_SECRET,
//     }),
//   });

//   const expressApp = server.expressApp;

//   expressApp.use(bodyParser.json());
//   expressApp.get("/", function (req, res) {
//     res.send("Hi");
//   });

//   expressApp.post("/webhook", (req, res) => {
//     console.log("Webhook from marketplace: ", req.body);
//     res.status(200).json({ success: "Webhook received successfully" });
//   });

//   await server.load(app);

//   server.start();
// }

// startServer();

run(app);
