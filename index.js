'use strict';
import TwilioVideoApp from './dist/twilio-video-app-react';

// this file loads the module in consuming web app
export default {
  VideoApp: TwilioVideoApp.VideoApp,
  AppStateProvider: TwilioVideoApp.AppStateProvider,
};
