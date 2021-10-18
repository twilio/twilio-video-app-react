import { Twilio } from 'twilio';

interface HeaderObj {
  [key: string]: string;
}

export class TwilioResponse {
  headers: HeaderObj = {};
  body: any;
  statusCode = 200;

  setStatusCode(code: number) {
    this.statusCode = code;
  }

  setBody(body: any) {
    this.body = body;
  }

  appendHeader(key: string, value: string) {
    this.headers[key] = value;
  }

  setHeaders(headers: HeaderObj) {
    this.headers = headers;
  }
}

const Runtime = {
  getAssets: () => ({
    '/auth-handler.js': {
      path: __dirname + '/auth-handler',
    },
  }),
};

interface TwilioGlobal extends Twilio {
  Response: typeof TwilioResponse;
}

declare global {
  namespace NodeJS {
    interface Global {
      Runtime: typeof Runtime;
      Twilio: TwilioGlobal;
    }
  }
}

// Bootstrap globals
global.Twilio = require('twilio');
global.Twilio.Response = TwilioResponse;
global.Runtime = Runtime;
