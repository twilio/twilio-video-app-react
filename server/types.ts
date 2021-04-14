import { Twilio } from 'twilio';
import { TwilioResponse } from './bootstrap-globals';

export interface ServerlessContext {
  getTwilioClient: () => Twilio;
  [key: string]: any;
}

export type ServerlessFunction = (
  context: ServerlessContext,
  body: any,
  callback: (err: any, response: TwilioResponse) => void
) => void;
