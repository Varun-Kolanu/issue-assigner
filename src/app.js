import {
  IssueCommentHandler,
  IssueOpenerHandler,
} from "./classes/event_handler.js";
import routes from "./routes/routes.js";

export default async (app, { getRouter }) => {
  // Define routes of server
  routes(getRouter);

  /* Webhooks received */

  // Issue opened by a user
  app.on("issues.opened", async (context) => {
    const issueOpenerHandlerObj = new IssueOpenerHandler(context);
    await issueOpenerHandlerObj.handleEvent();
  });

  // Comment is created in an issue by a user
  app.on(["issue_comment.created", "issue_comment.edited"], async (context) => {
    const issueCommentHandlerObj = new IssueCommentHandler(context);
    await issueCommentHandlerObj.handleEvent();
  });
};
