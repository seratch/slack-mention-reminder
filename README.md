## Slack Mention Reminder

"Mention Reminder" is a custom Slack app that allows you to set up reminders simply by mentioning its bot!

With this app, there's no need for you to run the `/remind` command. Why do we prefer a mention? It could be particularly useful when you aim to automate the creation of reminders within a Slack workflow.

<img width="500" src="https://github.com/seratch/slack-mention-reminder/assets/19658/96f2f8c7-3a05-4a4b-be0a-dd6871c1e943">

When your workflow sends a message mentioning this app's bot user, this app will set up a reminder with the inputs:

<img width="500" src="https://github.com/seratch/slack-mention-reminder/assets/19658/306c1911-0c10-4160-8d05-c812d52d812b">

## How it works

When you mention this app's bot user with the parameters listed below, the app will schedule a reminder message for you:

- [datetime]: When to send a reminder (in any format `new Date()` in JavaScript code can parse)
- [channel/user] Who/where to send it (@user or #channel)
- [message]: The text message to send

The format will be as follows. Please note that `[xxx]` portions can contain embedded values.

```
@MentionReminder remind [channel/user] at [datetime]\n
[message]
```

For example, this app delivers a message in #tasks channel at 9am on January 25:

```
@MentionReminder remind #tasks at 2024-01-25 09:00 +09:00
Hey @kaz, you need to submit this month's expense report by the end of today!
```

The time format may be in epoch time (in seconds). When using this app along with Slack's workflow builder, you can use a format that can be embedded:

<img width="400" src="https://github.com/seratch/slack-mention-reminder/assets/19658/d4d1ac02-bbc7-4c0b-aa09-1ea6cce10a37">

```
@MentionReminder remind #tasks at 1706183820
Hey @kaz, this is @brian's last week. Could you please check if the following accounts are prepared for termination soon:
• Google Workspace
• Zoom
• Slack
• ...
```

## Set up

### Create the app and install it

- Go to https://api.slack.com/apps?new_app=1
  - Choose "From an app manifest" and select the workspace to use
  - Switch to JSON format and past the content in `./manifest.json`
- Go to Settings > Install App
  - Install the app into your workspace
  - Save the "Bot User OAuth Token" as SLACK_BOT_TOKEN
- Go to Settings > Basic Information > App-Level Tokens
  - Click "Generate Token and Scopes"
  - Click "Add Scope" and then add "connections:write" scope
  - Name the token and click "Generate"
  - Save the token as SLACK_APP_TOKEN

### Run the app

- Install Node.js 20 or newer version
- Clone this repo
- Run `npm i` to install the dependencies
- Run `export SLACK_BOT_TOKEN=xoxb-....` (Settings > Install App)
- Run `export SLACK_APP_TOKEN=xapp-...` (Settings > Basic Information > App-Level Tokens)
- Run `npm start`

### Invite this app's bot user

- Invite this app's bot user `@MentionReminder` to the channel where you want to use it

### Add a step mentioning this app in your workflow

Create a workflow with the following steps:

- Open a form to collect inputs
  - Where/who to send (Select a channel/user)
  - When to send (Date and time)
  - The text message (Rich messsage composer)
- Send a message mentioning this app's bot user
  - `@MentionReminder remind [channe/user] at [datetime]\n[message]`

## Local development with Slack CLI

### Install CLI and grant permissions

If you haven't yet installed Slack CLI, I recommend visiting [the guide page](https://api.slack.com/automation/cli/install) to do so, and allowing it to install apps into your sandbox or paid Slack workspaces. To complete this, you will need to run `slack login` command on your terminal, plus execute `/slackauthticket` with the given parameter in your Slack workspace.

Please remember that either a sandbox or paid workpace is required to use the CLI.

### Start your app on your local machine

Once your CLI obtains the permission to install a local dev app, there is nothing else to prepare before running this template app. Clone this repo and install all the required npm packages:

```bash
git clone git@github.com:seratch/slack-mention-reminder.git slack-mention-reminder
cd slack-mention-reminder/
npm i
```

Now you can execute `slack run` to activate your first Slack app connected to a workspace via the CLI. The CLI automaticaly creates a new local dev app, which synchronizes the `manifest.json` data behind the scenes and establishes a Socket Mode connection (WebSocket protocol) with the authorized Slack workspace.

```bash
unset SLACK_APP_TOKEN
unset SLACK_BOT_TOKEN
slack run
```

If you see `[INFO]  socket-mode:SocketModeClient:0 Now connected to Slack` in the console output, the local dev app is successfully connected to your Slack workspace :tada:

Unlike before, you don't need to set any environment variables such as `SLACK_BOT_TOKEN`. The CLI passes the required variables to your app instance. If you have some env variables in the terminal session, you might need to unset them (e.g., `unset SLACK_BOT_TOKEN`) to prevent potential misbehavior.

## License

The MIT License
