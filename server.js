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

if (process.env.USE_BASIC_AUTH === 'true') {
  app.use((req, res, next) => {
    const USER_NAME = process.env.BASIC_AUTH_USERNAME;
    const PASSWORD = process.env.BASIC_AUTH_PASSWORD;

    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, password] = new Buffer.from(b64auth, 'base64').toString().split(':');

    if (login && password && login === USER_NAME && password === PASSWORD) {
      return next();
    }

    res.set('WWW-Authenticate', 'Basic realm="Restricted"');
    res.status(401).send('Authentication required.');
  });
}

app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'build/index.html')));
app.post('/token', (req, res) => {
  const { name, room } = req.body;
  const token = new AccessToken(twilioAccountSid, twilioApiKey, twilioApiSecret, { ttl: MAX_ALLOWED_SESSION_DURATION });
  token.identity = name;
  const videoGrant = new VideoGrant({ room });
  token.addGrant(videoGrant);
  res.json({ token: token.toJwt() });
  if (process.env.CI !== 'true') {
    console.log(`issued token for ${token.identity} in room ${req.body.room}`);
  }
});

app.listen(8080, () => console.log('token server running on 8080'));
