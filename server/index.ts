import './bootstrap-globals';
import WebSocket from 'ws';
import speech from '@google-cloud/speech';

import { createExpressHandler } from './createExpressHandler';
import express, { RequestHandler } from 'express';
import path from 'path';
import { ServerlessFunction } from './types';

// const VoiceResponse = require('twilio').twiml.VoiceResponse;

const PORT = process.env.PORT ?? 8081;

const app = express();

const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

//Include Google Speech to Text
const client = new speech.SpeechClient();

//Configure Transcription Request
const request = {
  config: {
    encoding: 'MULAW',
    sampleRateHertz: 8000,
    languageCode: 'en-us',
    enableAutomaticPunctuation: true,
    diarizationConfig: {
      enableSpeakerDiarization: true,
    },
    model: 'video', //https://cloud.google.com/speech-to-text/docs/transcription-model
    useEnhanced: true,
  },
  interimResults: true,
};

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

  let recognizeStream: any = null;

  ws.on('message', function incoming(message) {
    const msg = JSON.parse(message);
    switch (msg.event) {
      case 'connected':
        console.log(`A new call has connected.`);
        break;
      case 'start':
        // console.log(`Starting Media Stream ${msg.streamSid}`);
        // Create Stream to the Google Speech to Text API
        recognizeStream = client
          .streamingRecognize(request)
          .on('error', console.error)
          .on('data', data => {
            wss.clients.forEach(client => {
              if (client.readyState === WebSocket.OPEN) {
                if (data.results[0].isFinal) {
                  client.send(
                    JSON.stringify({
                      event: 'final-transcription',
                      text: data.results[0].alternatives[0].transcript,
                      channel: data.results[0].channelTag,
                      words: data.results[0].alternatives[0].words,
                    })
                  );
                } else {
                  client.send(
                    JSON.stringify({
                      event: 'interim-transcription',
                      text: data.results[0].alternatives[0].transcript,
                      channel: data.results[0].channelTag,
                    })
                  );
                }
              }
            });
          });
        break;
      case 'media':
        // Write Media Packets to the recognize stream
        recognizeStream.write(msg.media.payload);
        break;
      case 'stop':
        console.log(`Call Has Ended`);
        recognizeStream.destroy();
        break;
    }
  });
});

app.all('/token', authMiddleware, tokenEndpoint);
app.all('/recordingrules', authMiddleware, recordingRulesEndpoint);

// add endpoint to initiate adding a voice call to the video room
app.all('/voice', authMiddleware, (req, res) => {
  res.set('Content-Type', 'text/xml');

  res.send(`
    <Response>
      <Say>Transcribing</Say>
      <Start>
        <Stream url="wss://ceb6d833d771.ngrok.app" track="both_tracks"/>
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

server.listen(PORT);
