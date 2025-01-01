# Transcription App

This Slack App integrates with Whisper API to transcribe audio files and send the transcription data to a webhook. The bot accepts an audio URL submitted through Slack, processes the file, and sends the transcription with customizable form data to a webhook.

## Features
- Interactive Slack bot.
- Transcribe audio files using Whisper API.
- Send daya wherever you want using Webhooks.
- Built using environment variables for security.

## Prerequisites
- **Node.js**: Ensure you have Node.js >= 14.x installed.
- **Slack App**: Set up a Slack app with appropriate permissions.
- **Whisper API Key**: Obtain your API key from OpenAI.
- **Webhook**: Set up a webhook to receive data.

## Installation

1. Download files.
2. Install dependencies:
```bash
npm install
 ```
3. Create a .env file in the project root with the following content:
```bash
# Slack Bot Token (Bot user OAuth Token)
SLACK_BOT_TOKEN=xoxb-...

# Slack App Token (Socket mode)
SLACK_APP_TOKEN=xapp-...

# Slack Signing Secret
SLACK_SIGNING_SECRET=...

# OpenAI API Key
OPENAI_API_KEY=sk-proj-...

# Zapier Webhook Link
WEBHOOK_LINK=https://...
```

## Usage

1. **Start the bot**:
```bash
npm start
```
2. Invite the bot to a Slack channel and mention it to trigger the app:
```bash
@your-bot-name
```

## Project Structure

```
app/
├── .env                 # Environment variables
├── index.js             # App logic
├── manifest.json        # Slack app configuration
├── package.json         # Dependencies and scripts
```

## Contribution

Contributions are welcome! Feel free to open issues or submit pull requests.
