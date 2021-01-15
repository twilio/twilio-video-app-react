const express = require('express');
const app = express();
const path = require('path');
const Twilio = require('twilio');

const AccessToken = Twilio.jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
require('dotenv').config();

const MAX_ALLOWED_SESSION_DURATION = 14400;
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioApiKeySID = process.env.TWILIO_API_KEY_SID;
const twilioApiKeySecret = process.env.TWILIO_API_KEY_SECRET;

const client = Twilio(twilioApiKeySID, twilioApiKeySecret, { accountSid: twilioAccountSid });

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json());

app.get('/token', (req, res) => {
  const { identity, roomName } = req.query;
  const token = new AccessToken(twilioAccountSid, twilioApiKeySID, twilioApiKeySecret, {
    ttl: MAX_ALLOWED_SESSION_DURATION,
  });
  token.identity = identity;
  const videoGrant = new VideoGrant({ room: roomName });
  token.addGrant(videoGrant);
  res.send(token.toJwt());
  console.log(`issued token for ${identity} in room ${roomName}`);
});

app.post('/recordingrules', async (req, res) => {
  const { room_sid, rules } = req.body;

  try {
    const recordingRulesResponse = await client.video.rooms(room_sid).recordingRules.update({ rules });
    res.json(recordingRulesResponse);
    console.log('updated recording rules for room SID: ' + room_sid);
    console.log('rules: ' + JSON.stringify(rules));
  } catch (err) {
    res.status(500).json({ error: { message: err.message, code: err.code } });
  }
});

app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'build/index.html')));

app.listen(8081, () => console.log('token server running on 8081'));
