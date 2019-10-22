const app = require('express')();
const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
const bodyParser = require('body-parser');
require('dotenv').config();

const MAX_ALLOWED_SESSION_DURATION = 14400;
const twilioAccountSid = process.env.ACCOUNT_SID;
const twilioApiKey = process.env.API_KEY;
const twilioApiSecret = process.env.API_SECRET;

app.use(bodyParser.json());

app.post('/token', (req, res) => {
  const { name, room } = req.body;
  const token = new AccessToken(
    twilioAccountSid,
    twilioApiKey,
    twilioApiSecret,
    { ttl: MAX_ALLOWED_SESSION_DURATION }
  );
  token.identity = name;
  const videoGrant = new VideoGrant({ room });
  token.addGrant(videoGrant);
  res.json({ token: token.toJwt() });
  console.log(`issued token for ${token.identity} in room ${req.body.room}`);
});

app.listen(4000, () => console.log('token server running on 4000'));
