import { LocalVideoTrack, RemoteVideoTrack, TwilioError } from 'twilio-video';
import { EventEmitter } from 'events';

declare module 'twilio-video' {
  // These help to create union types between Local and Remote VideoTracks
  interface LocalVideoTrack {
    isSwitchedOff: undefined;
    setPriority: undefined;
  }

  function testPreflight(
    subscriberToken: string,
    publisherToken: string,
    options?: { duration?: number }
  ): PreflightTest;
}

declare global {
  interface Window {
    visualViewport?: {
      scale: number;
    };
  }

  interface MediaDevices {
    getDisplayMedia(constraints: MediaStreamConstraints): Promise<MediaStream>;
  }

  interface HTMLMediaElement {
    setSinkId?(sinkId: string): Promise<undefined>;
  }
}

export type Callback = (...args: any[]) => void;

export type ErrorCallback = (error: TwilioError) => void;

export type IVideoTrack = LocalVideoTrack | RemoteVideoTrack;

export type RoomType = 'group' | 'group-small' | 'peer-to-peer' | 'go';

export interface PreflightTestReport {
  isTurnRequired: boolean;
  stats: {
    jitter: {
      min: number;
      max: number;
      average: number;
    };
    rtt?: {
      min: number;
      max: number;
      average: number;
    };
    outgoingBitrate?: {
      min: number;
      max: number;
      average: number;
    };
    incomingBitrate?: {
      min: number;
      max: number;
      average: number;
    };
    packetLoss: {
      min: number;
      max: number;
      average: number;
    };
    networkQuality: {
      min: number;
      max: number;
      average: number;
    };
  };
}

export declare interface PreflightTest extends EventEmitter {
  on(event: 'completed', listener: (report: PreflightTestReport) => void): this;
  on(event: 'failed', listener: (error: Error) => void): this;
  stop: () => void;
}
