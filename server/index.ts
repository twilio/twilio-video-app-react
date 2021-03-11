import './bootstrap-globals';
import { createExpressHandler } from './createExpressHandler';
import express, { RequestHandler } from 'express';
import path from 'path';
import { ServerlessFunction } from './types';

const PORT = process.env.PORT ?? 8081;

const app = express();
app.use(express.json());

const tokenFunction: ServerlessFunction = require('@twilio-labs/plugin-rtc/src/serverless/functions/token').handler;
const tokenEndpoint = createExpressHandler(tokenFunction);

const noopMiddleware: RequestHandler = (_, __, next) => next();
const authMiddleware =
  process.env.REACT_APP_SET_AUTH === 'firebase' ? require('./firebaseAuthMiddleware') : noopMiddleware;

app.use(express.static(path.join(__dirname, '../build')));

app.all('/token', authMiddleware, tokenEndpoint);

app.get('*', (_, res) => res.sendFile(path.join(__dirname, '../build/index.html')));

app.listen(PORT, () => console.log(`twilio-video-app-react server running on ${PORT}`));
