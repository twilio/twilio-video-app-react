import './bootstrap-globals';
import WebSocket from 'ws';

import { createExpressHandler } from './createExpressHandler';
import express, { RequestHandler } from 'express';
import path from 'path';
import { ServerlessFunction } from './types';

// const VoiceResponse = require('twilio').twiml.VoiceResponse;

const PORT = process.env.PORT ?? 8081;

const app = express();

const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());

// This server reuses the serverless endpoints from the "plugin-rtc" Twilio CLI Plugin, which is used when the "npm run deploy:twilio-cli" command is run.
// The documentation for this endpoint can be found in the README file here: https://github.com/twilio-labs/plugin-rtc
const tokenFunction: ServerlessFunction = require('@twilio-labs/plugin-rtc/src/serverless/functions/token').handler;
const tokenEndpoint = createExpressHandler(tokenFunction);

const recordingRulesFunction: ServerlessFunction = require('@twilio-labs/plugin-rtc/src/serverless/functions/recordingrules')
  .handler;
const recordingRulesEndpoint = createExpressHandler(recordingRulesFunction);

const noopMiddleware: RequestHandler = (_, __, next) => next();
const authMiddleware =
  process.env.REACT_APP_SET_AUTH === 'firebase' ? require('./firebaseAuthMiddleware') : noopMiddleware;

// Handle Web Socket Connection
wss.on('connection', function connection(ws) {
  console.log('New Connection Initiated');

  ws.on('message', function incoming(msg: any) {
    console.log(msg);
    // const msg = JSON.parse(message);
    switch (msg.event) {
      case 'connected':
        console.log(`A new call has connected.`);
        break;
      case 'start':
        console.log(`Starting Media Stream ${msg.streamSid}`);
        break;
      case 'media':
        console.log(`Receiving Audio...`);
        break;
      case 'stop':
        console.log(`Call Has Ended`);
        break;
    }
  });
});

app.all('/token', authMiddleware, tokenEndpoint);
app.all('/recordingrules', authMiddleware, recordingRulesEndpoint);

// add endpoint to initiate adding a voice call to the video room
app.all('/voice', authMiddleware, (req, res) => {
  // const twiml = new VoiceResponse();
  // // twiml.say('Hello Nat!');
  // // twiml.play({}, 'https://demo.twilio.com/docs/classic.mp3');
  // const connect = twiml.connect();
  // connect.room(
  //   {
  //     participantIdentity: 'alice',
  //   },
  //   'DailyStandup'
  // );
  // const start = twiml.start();

  // start.stream({
  //   name: 'Example Audio Stream',
  //   url: 'wss://ceb6d833d771.ngrok.app',
  // });

  // // Render the response as XML in reply to the webhook request
  // res.type('text/xml');
  // res.send(twiml.toString());

  res.set('Content-Type', 'text/xml');

  res.send(`
    <Response>
      <Say>Transcribing</Say>
      <Start>
        <Stream url="wss://ceb6d833d771.ngrok.app"/>
      </Start>
      <Connect>
        <Room participantIdentity='transcriber'>DailyStandup</Room>
      </Connect>
      <Pause length="60" />
    </Response>
  `);
});

app.use((req, res, next) => {
  // Here we add Cache-Control headers in accordance with the create-react-app best practices.
  // See: https://create-react-app.dev/docs/production-build/#static-file-caching
  if (req.path === '/' || req.path === 'index.html') {
    res.set('Cache-Control', 'no-cache');
    res.sendFile(path.join(__dirname, '../build/index.html'), { etag: false, lastModified: false });
  } else {
    res.set('Cache-Control', 'max-age=31536000');
    next();
  }
});

app.use(express.static(path.join(__dirname, '../build')));

app.get('*', (_, res) => {
  // Don't cache index.html
  res.set('Cache-Control', 'no-cache');
  res.sendFile(path.join(__dirname, '../build/index.html'), { etag: false, lastModified: false });
});

app.listen(PORT, () => console.log(`twilio-video-app-react server running on ${PORT}`));
// server.listen(PORT);
