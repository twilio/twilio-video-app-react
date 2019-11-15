import 'twilio-video';

declare module 'twilio-video' {
  interface LocalParticipant {
    setBandwidthProfile: (bandwidthProfile: BandwidthProfileOptions) => void;
    publishTrack(track: LocalTrack, options?: { priority: Track.Priority }): Promise<LocalTrackPublication>;
  }

  interface VideoCodecSettings {
    simulcast?: boolean;
  }

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
