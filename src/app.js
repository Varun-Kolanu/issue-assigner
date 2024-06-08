import issue_comment_created from "./handlers/issue_comment_created.js";
import issue_opened from "./handlers/issue_opened.js";

export default (app, { getRouter }) => {
  const router = getRouter("/");
  router.get("/", (_, res) => {
    res.send("Welcome to Issue Assigner");
  });

  // Issue opened by a user
  app.on("issues.opened", issue_opened);

  // Comment is created in an issue by a user
  app.on("issue_comment.created", issue_comment_created);
};
