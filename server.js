const express = require('express');
const app = express();
const path = require('path');

const { getTwilioToken } = require('./functions/get-token/get-twilio-token');

app.use(express.static(path.join(__dirname, 'build')));

app.get('/token', async (req, res) => {
  res.send(await getTwilioToken(req.query));
});

app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'build/index.html')));

app.listen(8081, () => console.log('token server running on 8081'));
