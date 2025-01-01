# Transcription App

This Slack App integrates with Whisper API to transcribe audio files and send the transcription data to a webhook. The bot accepts an audio URL submitted through Slack, processes the file, and sends the transcription with customizable form data to a webhook.

## Features
- Interactive Slack bot.
- Transcribe audio files using Whisper API.
- Send data wherever you want using Webhooks.
- Built using environment variables for security.

## Setup and Installation

### Prerequisites
- **Node.js**: Ensure you have Node.js >= 14.x installed.
- **Slack App:** You can create the Slack app using the provided `manifest.json` file:
   - Go to your Slack workspace's app management page.
   - Select "Create New App" and choose the "From manifest" option.
   - Paste the contents of `manifest.json` to automatically configure the app.
- **Whisper API Key**: Obtain your API key from OpenAI.
- **Webhook**: Set up a webhook to receive data.

- Create a .env file in the project root with the following content:
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
### Installation

1. Download the repository.

2. Install dependencies:
```bash
npm install
 ```

### Running the app

Start the app in Socket Mode:

```bash
node index.js
```

Invite the app to a Slack channel and mention it to trigger the app:

```bash
@your-app-name
```

The App will log "⚡️ App is running in socket mode!" when successfully started.

## Usage

1. Mention the Bot in Slack.
2. Interact with the Modal.
3. Customizable outputs depending on Webhook settings.

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
