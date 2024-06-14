import bodyParser from "body-parser";

export default function routes(getRouter) {
  const router = getRouter("/issue-assigner");
  router.use(bodyParser.json());
  router.get("/", (_, res) => {
    res.status(200).send("Welcome to Issue Assigner");
  });

  router.post("/webhook", (req, res) => {
    console.log("Webhook from marketplace: ", req.body);
    res.status(200).json({ success: "Webhook received successfully" });
  });
}
