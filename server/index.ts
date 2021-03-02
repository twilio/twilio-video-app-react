import './bootstrap-globals';
import { createExpressHandler } from './createExpressHandler';
import express, { RequestHandler } from 'express';
import path from 'path';
import { ServerlessFunction } from './types';

const PORT = process.env.PORT ?? 8081;

const app = express();
app.use(express.json());

const noopMiddleware: RequestHandler = (_, __, next) => next();
const authMiddleware =
  process.env.REACT_APP_SET_AUTH === 'firebase' ? require('./firebaseAuthMiddleware') : noopMiddleware;

const tokenEndpoint: ServerlessFunction = require('@twilio-labs/plugin-rtc/src/serverless/functions/token').handler;
const recordingRulesEndpoint: ServerlessFunction = require('@twilio-labs/plugin-rtc/src/serverless/functions/recordingrules')
  .handler;

app.use(express.static(path.join(__dirname, '../build')));

app.all('/token', authMiddleware, createExpressHandler(tokenEndpoint));
app.all('/recordingrules', authMiddleware, createExpressHandler(recordingRulesEndpoint));

app.get('*', (_, res) => res.sendFile(path.join(__dirname, '../build/index.html')));

app.listen(PORT, () => console.log(`twilio-video-app-react server running on ${PORT}`));
