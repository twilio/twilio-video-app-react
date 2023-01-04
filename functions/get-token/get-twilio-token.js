const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

const MAX_ALLOWED_SESSION_DURATION = 14400;
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioApiKeySID = process.env.TWILIO_API_KEY_SID;
const twilioApiKeySecret = process.env.TWILIO_API_KEY_SECRET;

exports.getTwilioToken = async parameters => {
  const { identity, roomName } = parameters;
  const token = new AccessToken(twilioAccountSid, twilioApiKeySID, twilioApiKeySecret, {
    ttl: MAX_ALLOWED_SESSION_DURATION,
  });
  token.identity = identity;
  const videoGrant = new VideoGrant({ room: roomName });
  token.addGrant(videoGrant);
  console.log(`issued token for ${identity} in room ${roomName}`);

  return token.toJwt();
};
