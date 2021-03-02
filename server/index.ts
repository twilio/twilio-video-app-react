import express, { RequestHandler } from 'express';
import Twilio from 'twilio';
import path from 'path';
import './types';
import { TwilioResponse } from './bootstrap-globals';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(express.json());

const noopMiddleware: RequestHandler = (_, __, next) => next();

const authMiddleware =
  process.env.REACT_APP_SET_AUTH === 'firebase' ? require('./firebase-middleware') : noopMiddleware;

const tokenEndpoint = require('@twilio-labs/plugin-rtc/src/serverless/functions/token').handler;
const recordingRulesEndpoint = require('@twilio-labs/plugin-rtc/src/serverless/functions/recordingrules').handler;

const { TWILIO_ACCOUNT_SID, TWILIO_API_KEY_SID, TWILIO_API_KEY_SECRET, TWILIO_CONVERSATIONS_SERVICE_SID } = process.env;

const twilioClient = Twilio(TWILIO_API_KEY_SID, TWILIO_API_KEY_SECRET, {
  accountSid: TWILIO_ACCOUNT_SID,
});

const context = {
  ACCOUNT_SID: TWILIO_ACCOUNT_SID,
  TWILIO_API_KEY_SID,
  TWILIO_API_KEY_SECRET,
  ROOM_TYPE: 'group',
  CONVERSATIONS_SERVICE_SID: TWILIO_CONVERSATIONS_SERVICE_SID,
  getTwilioClient: () => twilioClient,
};

type ServerlessFunction = (
  c: typeof context,
  body: any,
  callback: (err: any, response: TwilioResponse) => void
) => void;

const handleFunction = (route: string, fn: ServerlessFunction) => {
  app.all(route, authMiddleware, (req, res) => {
    fn(context, req.body, (_, functionResponse) => {
      const { statusCode, headers, body } = functionResponse;
      res
        .status(statusCode)
        .set(headers)
        .json(body);
    });
  });
};

app.use(express.static(path.join(__dirname, 'build')));

handleFunction('/token', tokenEndpoint);
handleFunction('/recordingrules', recordingRulesEndpoint);

app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'build/index.html')));

app.listen(8081, () => console.log('token server running on 8081'));
