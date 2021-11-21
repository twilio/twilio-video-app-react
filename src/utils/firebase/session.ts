import { firestore } from 'firebase';
import { ISession, ISessionStore, UserGroup } from 'types';
import { db } from './base';

let _sessionStore: ISessionStore | null;
let _baseSubscription: any;
const _subscriptions: { [key: string]: any } = {};

const groupTokenValid = (groupToken: string) => {
  return typeof groupToken === 'string' && groupToken.length === 0;
};

const processSnapshot = (groupToken: string, snapshot: firestore.QuerySnapshot<firestore.DocumentData>) => {
  const docs = snapshot.docs;
  if (snapshot.empty || !docs[0]) {
    return null;
  }

  const data = docs[0].data() as ISession;
  const group = data.shareTokens[groupToken].toUpperCase() as UserGroup;
  return { doc: docs[0], data, group };
};

export const getSessionStore = (groupToken: string) =>
  new Promise<ISessionStore>((resolve, reject) => {
    if (_sessionStore) {
      resolve(_sessionStore);
    }

    if (groupTokenValid(groupToken)) {
      throw new Error('shareToken undefined.');
    }

    db()
      .collection('sessions')
      .where('shareTokens.' + groupToken, '!=', null)
      .get()
      .then(snapshot => {
        _sessionStore = processSnapshot(groupToken, snapshot);
        if (_sessionStore === null) {
          reject();
        } else {
          resolve(_sessionStore);
        }
      })
      .catch(reject);
  });

export const subscribeToSessionStore = (
  subId: string,
  groupToken: string,
  callback: (sessionStore: ISessionStore) => void
) => {
  _subscriptions[subId] = callback;

  if (_baseSubscription === undefined) {
    getSessionStore(groupToken).then(store => {
      _baseSubscription = db()
        .collection('sessions')
        .doc(store.doc.id)
        .onSnapshot(doc => {
          if (!doc) {
            return;
          }

          const data = doc.data();
          if (data !== undefined) {
            const group = data.shareTokens[groupToken].toUpperCase() as UserGroup;
            _sessionStore = { doc: doc, data: doc.data() as ISession, group };
            Object.entries(_subscriptions).forEach(([key, cb]) => {
              if (typeof cb === 'function') {
                cb(_sessionStore);
              } else {
                delete _subscriptions[key];
              }
            });
          }
        });
    });
  } else if (_sessionStore !== null) {
    callback(_sessionStore);
  }
};

export const unsubscribeFromSessionStore = (subId: string) => {
  delete _subscriptions[subId];
};

const updateSession = async (groupToken: string, payload: firestore.UpdateData) => {
  if (groupTokenValid(groupToken)) {
    throw new Error('shareToken undefined.');
  }

  await getSessionStore(groupToken).then(store => {
    db()
      .collection('sessions')
      .doc(store.doc.id)
      .update(payload);
  });
};

export const startSession = (groupToken: string) =>
  updateSession(groupToken, {
    startDate: firestore.FieldValue.serverTimestamp(),
    endDate: firestore.Timestamp.fromDate(
      firestore.Timestamp.fromMillis(firestore.Timestamp.now().toMillis() + 1000 * 60 * 60).toDate()
    ),
    hasEnded: false,
  });

export const reactivateSession = async (groupToken: string) => startSession(groupToken);

export const addSessionModerator = async (groupToken: string, sid: string) =>
  updateSession(groupToken, { moderators: firestore.FieldValue.arrayUnion(sid) });

export const endSession = async (groupToken: string) => updateSession(groupToken, { hasEnded: true });

export const muteParticipant = async (groupToken: string, sid: string) =>
  updateSession(groupToken, { muted: firestore.FieldValue.arrayUnion(sid) });

export const unmuteParticipant = async (groupToken: string, sid: string) =>
  updateSession(groupToken, { muted: firestore.FieldValue.arrayRemove(sid) });

export const setRoomSid = async (groupToken: string, roomSid: string) => updateSession(groupToken, { roomSid });

export const raiseHand = async (groupToken: string, identity: string) =>
  updateSession(groupToken, { raisedHands: firestore.FieldValue.arrayUnion(identity) });

export const unraiseHand = async (groupToken: string, identity: string) =>
  updateSession(groupToken, { raisedHands: firestore.FieldValue.arrayRemove(identity) });

export const inviteAudienceMember = async (groupToken: string, identity: string) =>
  updateSession(groupToken, {
    audienceInvites: firestore.FieldValue.arrayUnion(identity),
    raisedHands: firestore.FieldValue.arrayRemove(identity),
  });

export const removeAudienceMemberInvitation = async (groupToken: string, identity: string) =>
  updateSession(groupToken, { audienceInvites: firestore.FieldValue.arrayRemove(identity) });

export const banParticipant = async (groupToken: string, identity: string) =>
  updateSession(groupToken, { banned: firestore.FieldValue.arrayUnion(identity) });

export const unbanParticipant = async (groupToken: string, identity: string) =>
  updateSession(groupToken, { banned: firestore.FieldValue.arrayRemove(identity) });
