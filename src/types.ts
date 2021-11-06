import { firestore } from 'firebase';
import { LocalVideoTrack, RemoteVideoTrack, TwilioError } from 'twilio-video';

declare module 'twilio-video' {
  // These help to create union types between Local and Remote VideoTracks
  interface LocalVideoTrack {
    isSwitchedOff: undefined;
    setPriority: undefined;
  }
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

  // Helps create a union type with TwilioError
  interface Error {
    code: undefined;
  }
}

export type Callback = (...args: any[]) => void;

export type ErrorCallback = (error: TwilioError | Error) => void;

export type IVideoTrack = LocalVideoTrack | RemoteVideoTrack;

export type RoomType = 'group' | 'group-small' | 'peer-to-peer' | 'go';

export type RecordingRule = {
  type: 'include' | 'exclude';
  all?: boolean;
  kind?: 'audio' | 'video';
  publisher?: string;
};

export type RecordingRules = RecordingRule[];

export enum UserGroup {
  Viewer = 'VIEWER',
  Moderator = 'MODERATOR',
}

export interface ISessionLabels {
  title: string;
}

export interface ISession {
  author: string;
  shareTokens: {
    [key: string]: UserGroup;
  };
  roomId: string;
  labels: ISessionLabels;
  isPaused?: boolean;
  startDate?: firestore.Timestamp;
  endDate?: firestore.Timestamp;
  hasEnded?: boolean;
  activeScreen: ScreenType;

  //user sid's:
  moderators?: string[];
  muted?: string[];
}

export interface ISessionStore {
  data: ISession;
  group: UserGroup;
  doc: firestore.QueryDocumentSnapshot<firestore.DocumentData> | firestore.DocumentSnapshot<firestore.DocumentData>;
}

export enum ScreenType {
  VideoChat = 'VIDEOCHAT',
  Game = 'GAME',
}

export interface ICarouselGame {
  currentPlayer: string;
  carouselPosition: number;
  activeCard: number;
  seed: number;
  currentSpinCount: number;
  playerRoundCount?: { [key: string]: number };
}

export const DEFAULT_QUESTION_COLOR = '#f00';

export interface IQuestion {
  //TODO: add categorie color
  category: string;
  name: string;
  catId: string;
  color: string; //not in db
}

export interface ICategory {
  color: string;
  name: string;
}
