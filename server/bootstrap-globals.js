class Response {
  headers = {};

  setStatusCode(code) {
    this.statusCode = code;
  }

  setBody(body) {
    this.body = body;
  }

  appendHeader(key, value) {
    this.headers[key] = value;
  }

  send(res) {
    res
      .set(this.headers)
      .status(this.statusCode)
      .json(this.body);
  }
}

const Runtime = {
  getAssets: () => ({
    '/auth-handler.js': {
      path: __dirname + '/auth-handler',
    },
  }),
};

// Bootstrap globals
global.Twilio = require('twilio');
global.Twilio.Response = Response;
global.Runtime = Runtime;
