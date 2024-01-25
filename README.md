## Slack Mention Reminder

"Mention Reminder" is a custom Slack app that allows you to set up reminders simply by mentioning its bot!

<img width="500" src="https://github.com/seratch/slack-mention-reminder/assets/19658/e1323357-c449-46fa-ad84-b406446b008a">

With this app, there's no need for you to run the `/remind` command. Why do we prefer a mention? It could be particularly useful when you aim to automate the creation of reminders within a Slack workflow.

<img width="500" src="https://github.com/seratch/slack-mention-reminder/assets/19658/23760d3b-0224-46ee-8633-38e1b850afd5">

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
  - Switch to YAML format and past the content in `app-manifest.yml`
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

## License

The MIT License
