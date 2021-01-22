const { getTwilioToken } = require('./get-twilio-token');

exports.handler = async event => {
  return {
    statusCode: 200,
    body: await getTwilioToken(event.queryStringParameters),
  };
};
