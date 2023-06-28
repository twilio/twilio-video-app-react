const WebSocket = require('ws');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

// Handle Web Socket Connection
wss.on('connection', function connection(ws: any) {
  console.log('New Connection Initiated');

  ws.on('message', function incoming(message: string) {
    const msg = JSON.parse(message);
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

//Handle HTTP Request
app.get('/', (req, res: any) => res.send('Hello World'));

console.log('Listening at Port 8080');
server.listen(8080);
