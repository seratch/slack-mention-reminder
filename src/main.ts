import { SocketModeClient } from "@slack/socket-mode";
import { LogLevel } from "@slack/logger";
import {
  fromSocketModeToRequest,
  fromResponseToSocketModePayload,
} from "slack-edge";

import { app } from "./app";

(async () => {
  const sm = new SocketModeClient({
    appToken: process.env.SLACK_APP_TOKEN!,
    logLevel: LogLevel.DEBUG,
  });
  sm.on("slack_event", async ({ body, ack, retry_num, retry_reason }) => {
    const request = fromSocketModeToRequest({
      body,
      retryNum: retry_num,
      retryReason: retry_reason,
    });
    if (!request) {
      return;
    }
    const response = await app.run(request);
    await ack(await fromResponseToSocketModePayload({ response }));
  });
  await sm.start();
})();
