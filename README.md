# Aplicativo de Transcrição

Este aplicativo para **Slack** integra-se à **API Whisper** para transcrever arquivos de áudio e enviar os dados da transcrição para um **webhook**. A aplicação aceita uma **URL de áudio** enviada pelo Slack, processa o arquivo e envia a transcrição junto com dados personalizados de formulário para o webhook configurado.

## Funcionalidades

- Aplicativo interativo para Slack.  
- Transcrição de arquivos de áudio utilizando a **Whisper API**.  
- Envio dos dados transcritos para qualquer destino via **Webhooks**.  
- Configuração segura através de **variáveis de ambiente**.

## Configuração e Instalação

### Pré-requisitos

- **Node.js**: Certifique-se de ter o Node.js **>= 14.x** instalado.  
- **Aplicativo Slack:** Você pode criar o app utilizando o arquivo `manifest.json` fornecido:
  1. Acesse a página de gerenciamento de apps do seu workspace Slack.  
  2. Selecione **“Create New App”** e escolha a opção **“From manifest”**.  
  3. Cole o conteúdo de `manifest.json` para configurar automaticamente o app.  
- **Chave da API Whisper (OpenAI)** — obtenha sua chave em [https://platform.openai.com/](https://platform.openai.com/).  
- **Webhook:** configure um endpoint para receber os dados da transcrição.

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```bash
# Token do Bot do Slack (Bot user OAuth Token)
SLACK_BOT_TOKEN=xoxb-...

# Token do App do Slack (Socket Mode)
SLACK_APP_TOKEN=xapp-...

# Slack Signing Secret
SLACK_SIGNING_SECRET=...

# Chave da API OpenAI
OPENAI_API_KEY=sk-proj-...

# Link do Webhook (ex: Zapier, n8n, etc.)
WEBHOOK_LINK=https://...
```

### Instalação

1. Faça o download do repositório.  
2. Instale as dependências:

```bash
npm install
```

### Executando o aplicativo

Inicie o app no modo **Socket Mode**:

```bash
node index.js
```

Em seguida, **convide o aplicativo para um canal do Slack** e mencione-o para disparar a interação:

```bash
@nome-do-seu-app
```

Se a inicialização for bem-sucedida, o terminal exibirá:

```
⚡️ App is running in socket mode!
```

## Uso

1. Mencione o aplicativo em um canal do Slack.  
2. Interaja com o **modal** exibido.  
3. Os resultados podem ser personalizados de acordo com as configurações do webhook.

## 🗂 Estrutura do Projeto

```
app/
├── .env                 # Variáveis de ambiente
├── index.js             # Lógica principal da aplicação
├── manifest.json        # Configuração do app Slack
├── package.json         # Dependências e scripts
```

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir **issues** ou enviar **pull requests** com melhorias e novas funcionalidades.
