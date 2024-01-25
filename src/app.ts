import { SlackAPIError, SlackApp } from "slack-edge";

export const app = new SlackApp({
  socketMode: true,
  env: {
    SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN!,
    SLACK_APP_TOKEN: process.env.SLACK_APP_TOKEN!,
    SLACK_LOGGING_LEVEL: "DEBUG",
  },
});

// @this-bot remind #tasks at 2024-01-25 09:00 +09:00 \n the message here
// @this-bot remind #tasks at 1706180400 \n the message here
const parser = /<@.+>\s+remind\s+<#?@?(\w+)\|?.*>\s+at\s+(.+)\n([^]+)$/;

app.event("app_mention", async ({ payload, context }) => {
  const parsed = parser.exec(payload.text);
  let error: string | undefined;
  if (parsed) {
    const [_, channelOrUser, time, text] = parsed;
    let channel = channelOrUser;
    if (channelOrUser.startsWith("U") || channelOrUser.startsWith("W")) {
      try {
        const dm = await context.client.conversations.open({
          users: channelOrUser,
        });
        channel = dm.channel!.id!;
      } catch (e: unknown) {
        const code = (e as SlackAPIError).error;
        error = `Failed to start a DM with <@${channelOrUser}> due to ${code}`;
      }
    }
    let validTime: string | number = time;
    if (time.match(/^\d+$/)) {
      validTime = Number.parseInt(time) * 1000;
    }
    const post_at = new Date(validTime).getTime() / 1000;
    const now = new Date().getTime() / 1000;
    if (isNaN(post_at)) {
      error = `Failed to parse the time: ${validTime}`;
    }
    if (post_at - now < 60 * 3) {
      error = `Scheduled too soon: ${validTime}`;
    }
    if (!error) {
      try {
        await context.client.chat.scheduleMessage({ channel, text, post_at });
        return;
      } catch (e: unknown) {
        const code = (e as SlackAPIError).error;
        error = `Failed to schedule a message due to ${code}`;
      }
    }
  }
  if (error) {
    await context.say({
      text: `:x: Oops! This app failed to parse your input! (${error})`,
    });
  }
});

app.anyMessage(async () => {});
