require('dotenv').config();
const { App } = require('@slack/bolt');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

// Inicializa o app do Slack em modo Socket
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true
});

// Responde a uma menção ao app com botões interativos
app.event('app_mention', async ({ event, say }) => {
  await say({
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'Olá! Clique no botão abaixo para abrir o formulário de preenchimento:'
        }
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Preencher o formulário'
            },
            action_id: 'form_action'
          }
        ]
      }
    ]
  });
});

// Manipulador do formulário
app.action('form_action', async ({ ack, body, client }) => {
  await ack();
  openModal(client, body.trigger_id);
});

// Abre o modal
async function openModal(client, trigger_id) {
  try {
    await client.views.open({
      trigger_id: trigger_id,
      view: {
        type: 'modal',
        callback_id: 'submit_form_modal',
        title: {
          type: 'plain_text',
          text: 'Preencha os detalhes'
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
              text: 'Campo 1' // Campo customizado Exemplo: "Nome da empresa"
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
              text: 'Campo 2' // Campo customizado Exemplo: "Nome da empresa"
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
              text: 'Link do áudio'
            }
          }
        ],
        submit: {
          type: 'plain_text',
          text: 'Enviar'
        }
      }
    });
  } catch (error) {
    console.error('Erro ao abrir o modal:', error);
  }
}

// Manipulador do envio do modal
app.view('submit_form_modal', async ({ ack, body, view, client }) => {
  await ack();

  const field1 = view.state.values.field_1_block.field_1_action.value;
  const field2 = view.state.values.field_2_block.field_2_action.value;
  const audioLink = view.state.values.audio_link_block.audio_link_action.value;

  try {
    // Faz o download do arquivo de áudio
    const audioFilePath = 'audio.mp3'; // Caminho onde o arquivo de áudio será salvo
    const audioResponse = await axios({
      method: 'GET',
      url: audioLink,
      responseType: 'stream'
    });

    const writer = fs.createWriteStream(audioFilePath);
    audioResponse.data.pipe(writer);

    writer.on('finish', async () => {
      try {
        // Envia o áudio para a API Whisper
        const form = new FormData();
        form.append('file', fs.createReadStream(audioFilePath));
        form.append('model', 'whisper-1');

        const whisperResponse = await axios.post('https://api.openai.com/v1/audio/transcriptions', form, {
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': `multipart/form-data; boundary=${form._boundary}`
          },
          timeout: 300000 // 300 segundos de timeout
        });

        const transcription = whisperResponse.data.text;

        const webhookLink = process.env.WEBHOOK_LINK;

        // Envia dados e transcrição para o Webhook
        await axios.post(webhookLink, {
          field1,
          field2,
          audioLink,
          transcription
        });

        await client.chat.postMessage({
          channel: body.user.id,
          text: 'Dados enviados com sucesso!'
        });
      } catch (error) {
        console.error('Erro ao transcrever o áudio:', error);
      }
    });

    writer.on('error', (error) => {
      console.error('Erro ao salvar o arquivo de áudio:', error);
    });
  } catch (error) {
    console.error('Erro no download do arquivo de áudio:', error);
  }
});

// Inicia o app em modo Socket
(async () => {
  await app.start();
  console.log('⚡️ Aplicativo em execução no modo socket!');
})();
