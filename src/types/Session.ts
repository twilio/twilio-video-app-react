import { firestore } from 'firebase';
import { ScreenType } from './ScreenType';
import { UserGroup } from './UserGroup';

export interface ISessionResources {
  title: string;
  hostLogoSrc: string;
}

export interface ISession {
  author: string;
  shareTokens: {
    [key: string]: UserGroup;
  };
  roomId: string;
  resources?: ISessionResources;
  isPaused?: boolean;
  startDate?: firestore.Timestamp;
  endDate?: firestore.Timestamp;
  hasEnded?: boolean;
  activeScreen: ScreenType;
  streamIds?: {
    original?: string;
    translated?: string;
  };
  roomSid?: string;

  //user groups
  moderators?: string[]; //sid
  muted?: string[]; //identity
  raisedHands?: string[]; //identity
  audienceInvites?: string[]; //identity
  banned?: string[]; //idenity - uid based ban system
}

export interface ISessionStore {
  data: ISession;
  group: UserGroup;
  doc: firestore.QueryDocumentSnapshot<firestore.DocumentData> | firestore.DocumentSnapshot<firestore.DocumentData>;
}
