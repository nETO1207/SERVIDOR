const fetch = require('node-fetch');
const twilio = require('twilio');

// Configurações do ThingSpeak
const thingSpeakChannelID = 'SEU_ID_DO_CANAL_THINGSPEAK';
const thingSpeakReadAPIKey = 'SEU_API_KEY_DE_LEITURA_DO_THINGSPEAK';

// Configurações do Twilio
const accountSid = 'SUA_ACCOUNT_SID_DO_TWILIO';
const authToken = 'SEU_AUTH_TOKEN_DO_TWILIO';
const twilioNumber = 'SEU_NUMERO_TWILIO';
const recipientNumber = 'NUMERO_DESTINO';

// Função para buscar os dados mais recentes do ThingSpeak
async function fetchThingSpeakData() {
    const url = `https://api.thingspeak.com/channels/${thingSpeakChannelID}/fields/1/last.json?api_key=${thingSpeakReadAPIKey}`;
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            return parseFloat(data.field1);
        } else {
            console.error('Erro ao buscar dados do ThingSpeak:', response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Erro ao buscar dados do ThingSpeak:', error);
        return null;
    }
}

// Função para enviar mensagem SMS usando Twilio
function sendSMS(message) {
    const client = twilio(accountSid, authToken);
    client.messages
        .create({
            body: message,
            from: twilioNumber,
            to: recipientNumber
        })
        .then(message => console.log('Mensagem SMS enviada SID:', message.sid))
        .catch(error => console.error('Erro ao enviar mensagem SMS:', error));
}

// Função para verificar dados do ThingSpeak e enviar SMS se necessário
async function checkAndSendSMS() {
    const data = await fetchThingSpeakData();
    if (data !== null && data > 200) {
        const message = `Aviso: Nível de água excedeu o limite!`;
        sendSMS(message);
    }
}

// Verificar e enviar SMS a cada 5 minutos
setInterval(checkAndSendSMS, 5 * 60 * 1000);
