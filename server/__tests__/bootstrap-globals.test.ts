import '../bootstrap-globals';
import { TwilioResponse } from '../bootstrap-globals';

describe('the "Twilio.Response" global variable', () => {
  let response: TwilioResponse;
  beforeEach(() => {
    response = new global.Twilio.Response();
  });

  it('should set headers individually', () => {
    response.appendHeader('foo', 'bar');
    response.appendHeader('test', '123');
    expect(response.headers).toEqual({ foo: 'bar', test: '123' });
  });

  it('should set a header object', () => {
    response.setHeaders({ foo: 'bar', baz: 'test' });
    expect(response.headers).toEqual({ foo: 'bar', baz: 'test' });
  });

  it('should set a status code', () => {
    response.setStatusCode(401);
    expect(response.statusCode).toEqual(401);
  });

  it('should use a default status code of 200', () => {
    expect(response.statusCode).toEqual(200);
  });

  it('should set a body', () => {
    response.setBody({ token: 'mockToken' });
    expect(response.body).toEqual({ token: 'mockToken' });
  });
});

describe('the Twilio.Runtime.getAssets function', () => {
  it('should return a no-op function for the auth-handler.js file', () => {
    const runtime = global.Runtime.getAssets();
    const authHandler = require(runtime['/auth-handler.js'].path);
    authHandler();
  });
});
