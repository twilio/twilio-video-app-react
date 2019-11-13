import 'twilio-video';

declare module 'twilio-video' {
  interface LocalVideoTrack {
    isSwitchedOff: undefined;
  }

  interface RemoteVideoTrack {
    isSwitchedOff: boolean;
  }
}

declare global {
  interface MediaDevices {
    getDisplayMedia(): Promise<MediaStream>;
  }
}
