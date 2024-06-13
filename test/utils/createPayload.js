import payloadIssueOpened from "../fixtures/issues.opened.json" with { type: "json" };
import payloadIssueComment from "../fixtures/issue_comment.created.json" with { type: "json" };

export const createPayloadIssueOpened = (login) => {
  return {
    ...payloadIssueOpened,
    issue: {
      ...payloadIssueOpened.issue,
      user: { login },
    },
  };
};

export const createPayloadIssueComment = (login, body, haveAssignee = false) => {
    return {
      ...payloadIssueComment,
      issue: {
        ...payloadIssueComment.issue,
        assignees: haveAssignee ? [{
          "login": "assignee1"
        }] : []
      },
      comment: {
        user: {
            login
        },
        body
      }
    };
  };
