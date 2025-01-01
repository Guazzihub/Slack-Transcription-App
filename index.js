require('dotenv').config();
const { App } = require('@slack/bolt');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

// Initializes Slack app in Socket mode
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true
});

// Respond to a app mention with interactive buttons
app.event('app_mention', async ({ event, say }) => {
  await say({
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'Hello! Please click the button below to fill out the form:'
        }
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Fill Out Form'
            },
            action_id: 'form_action'
          }
        ]
      }
    ]
  });
});

// Form handler
app.action('form_action', async ({ ack, body, client }) => {
  await ack();
  openModal(client, body.trigger_id);
});

// Open the modal
async function openModal(client, trigger_id) {
  try {
    await client.views.open({
      trigger_id: trigger_id,
      view: {
        type: 'modal',
        callback_id: 'submit_form_modal',
        title: {
          type: 'plain_text',
          text: 'Fill in the details'
        },
        blocks: [
          {
            type: 'input',
            block_id: 'field_1_block',
            element: {
              type: 'plain_text_input',
              action_id: 'field_1_action'
            },
            label: {
              type: 'plain_text',
              text: 'Field 1' // Customizable field, e.g., "Company Name"
            }
          },
          {
            type: 'input',
            block_id: 'field_2_block',
            element: {
              type: 'plain_text_input',
              action_id: 'field_2_action'
            },
            label: {
              type: 'plain_text',
              text: 'Field 2' // Customizable field, e.g., "Company Phone"
            }
          },
          {
            type: 'input',
            block_id: 'audio_link_block',
            element: {
              type: 'plain_text_input',
              action_id: 'audio_link_action'
            },
            label: {
              type: 'plain_text',
              text: 'Audio File Link'
            }
          }
        ],
        submit: {
          type: 'plain_text',
          text: 'Submit'
        }
      }
    });
  } catch (error) {
    console.error('Error opening the modal:', error);
  }
}

// Handler for modal submission
app.view('submit_form_modal', async ({ ack, body, view, client }) => {
  await ack();

  const field1 = view.state.values.field_1_block.field_1_action.value;
  const field2 = view.state.values.field_2_block.field_2_action.value;
  const audioLink = view.state.values.audio_link_block.audio_link_action.value;

  try {
    // Download the audio file
    const audioFilePath = 'audio.mp3'; // Define the path where the audio file will be saved
    const audioResponse = await axios({
      method: 'GET',
      url: audioLink,
      responseType: 'stream'
    });

    const writer = fs.createWriteStream(audioFilePath);
    audioResponse.data.pipe(writer);

    writer.on('finish', async () => {
      try {
        // Sends the audio to Whisper API
        const form = new FormData();
        form.append('file', fs.createReadStream(audioFilePath));
        form.append('model', 'whisper-1');

        const whisperResponse = await axios.post('https://api.openai.com/v1/audio/transcriptions', form, {
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': `multipart/form-data; boundary=${form._boundary}`
          },
          timeout: 300000 // 300 seconds timeout
        });

        const transcription = whisperResponse.data.text;

        const webhookLink = process.env.WEBHOOK_LINK;

      // Sends data and transcription to Webhook.
        await axios.post(webhookLink, {
          field1,
          field2,
          audioLink,
          transcription
      });

        await client.chat.postMessage({
          channel: body.user.id,
          text: 'The data has been successfully sent!'
        });
      } catch (error) {
        console.error('Error transcribing audio or sending data:', error);
      }
    });
  } catch (error) {
    console.error('Error downloading the audio file:', error);
  }
});

// Starts app in Socket mode
(async () => {
  await app.start();
  console.log('⚡️ Bot is running in socket mode!');
})();
