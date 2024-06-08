const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 3002;

app.use(bodyParser.json());
app.use(cors());

// Rota para enviar SMS
app.post('/sendSMS', async (req, res) => {
    const { phoneNumber, message } = req.body;
    const twilioSID = 'AC0a12cbb0b7b14be0e67de39714023251';
    const twilioToken = '28c886e96f1c945e8d74345e1196446f';
    const twilioNumber = '+12183944325';

    try {
        const response = await axios.post('https://api.twilio.com/2010-04-01/Accounts/' + twilioSID + '/Messages.json', new URLSearchParams({
            To: phoneNumber,
            From: twilioNumber,
            Body: message
        }), {
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`${twilioSID}:${twilioToken}`).toString('base64'),
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        if (response.status === 201) {
            console.log('Mensagem SMS enviada com sucesso!');
            res.status(201).send({ success: true });
        } else {
            console.error('Erro ao enviar mensagem SMS:', response.status, response.statusText);
            res.status(response.status).send({ success: false, error: response.statusText });
        }
    } catch (error) {
        console.error('Erro ao enviar mensagem SMS:', error);
        res.status(500).send({ success: false, error: error.message });
    }
});

// Rota para buscar dados do ThingSpeak
app.get('/data', async (req, res) => {
    const thingSpeakChannelId = '2572791';
    const thingSpeakReadApiKey = 'Z9Q3S6TAX59RH25M';

    try {
        const response = await axios.get(`https://api.thingspeak.com/channels/${thingSpeakChannelId}/feeds.json`, {
            params: {
                api_key: thingSpeakReadApiKey,
                results: 100
            }
        });

        const feeds = response.data.feeds;
        res.status(200).send(feeds);
    } catch (error) {
        console.error('Erro ao buscar dados do ThingSpeak:', error);
        res.status(500).send({ error: 'Erro ao buscar dados do ThingSpeak' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
