const express = require('express');
const app = express();
const Twilio = require('twilio');
require('dotenv').config();
require('./bootstrap-globals');

app.use(express.json());

const tokenEndpoint = require('@twilio-labs/plugin-rtc/src/serverless/functions/token').handler;
const recordingRulesEndpoint = require('@twilio-labs/plugin-rtc/src/serverless/functions/recordingrules').handler;

const { TWILIO_ACCOUNT_SID, TWILIO_API_KEY_SID, TWILIO_API_KEY_SECRET, TWILIO_CONVERSAIONS_SERVICE_SID } = process.env;

const twilioClient = Twilio(TWILIO_API_KEY_SID, TWILIO_API_KEY_SECRET, {
  accountSid: TWILIO_ACCOUNT_SID,
});

const context = {
  ACCOUNT_SID: TWILIO_ACCOUNT_SID,
  TWILIO_API_KEY_SID,
  TWILIO_API_KEY_SECRET,
  ROOM_TYPE: 'group',
  CONVERSATIONS_SERVICE_SID: TWILIO_CONVERSAIONS_SERVICE_SID,
  getTwilioClient: () => twilioClient,
};

const handleFunction = (route, fn) => {
  app.all(route, (req, res) => {
    fn(context, req.body, (_, functionResponse) => functionResponse.send(res));
  });
};

handleFunction('/token', tokenEndpoint);
handleFunction('/recordingrules', recordingRulesEndpoint);

app.listen(8081, () => console.log('token server running on 8081'));
