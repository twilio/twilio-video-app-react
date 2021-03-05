import './bootstrap-globals';
import { createExpressHandler } from './createExpressHandler';
import express from 'express';
import path from 'path';
import { ServerlessFunction } from './types';

const PORT = process.env.PORT ?? 8081;

const app = express();
app.use(express.json());

const tokenEndpoint: ServerlessFunction = require('@twilio-labs/plugin-rtc/src/serverless/functions/token').handler;

app.use(express.static(path.join(__dirname, '../build')));

app.all('/token', createExpressHandler(tokenEndpoint));

app.get('*', (_, res) => res.sendFile(path.join(__dirname, '../build/index.html')));

app.listen(PORT, () => console.log(`twilio-video-app-react server running on ${PORT}`));
