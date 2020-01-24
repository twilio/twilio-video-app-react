const express = require('express');
const app = express();
const path = require('path');
const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
const bodyParser = require('body-parser');
require('dotenv').config();

const MAX_ALLOWED_SESSION_DURATION = 14400;
const twilioAccountSid = process.env.ACCOUNT_SID;
const twilioApiKey = process.env.API_KEY;
const twilioApiSecret = process.env.API_SECRET;

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'build/index.html')));

app.post('/token', ({body: {name, room}}, res) => {
  const token = new AccessToken(twilioAccountSid, twilioApiKey, twilioApiSecret, { ttl: MAX_ALLOWED_SESSION_DURATION });
  token.identity = name;
  const videoGrant = new VideoGrant({ room });
  token.addGrant(videoGrant);
  res.json({ token: token.toJwt() });
  console.log(`issued token for ${name} in room ${room}`);
});

app.listen(8080, () => console.log('token server running on 8080'));
