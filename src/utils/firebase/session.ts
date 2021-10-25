import { firestore } from 'firebase';
import { ISession, UserGroup } from 'types';
import { db } from './base';

type Store = { data: ISession; group: UserGroup; doc: firestore.QueryDocumentSnapshot<firestore.DocumentData> };

let _sessionStore: Store | null;
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
  new Promise<Store>((resolve, reject) => {
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

export const subscribeToSession = (
  subName: string,
  groupToken: string,
  callback: (data: ISession, userGroup: UserGroup) => void
) => {
  if (_subscriptions[subName]) {
    _subscriptions[subName]();
  }

  if (groupTokenValid(groupToken)) {
    throw new Error('shareToken undefined.');
  }

  _subscriptions[subName] = db()
    .collection('sessions')
    .where('shareTokens.' + groupToken, '!=', null)
    .onSnapshot(snapshot => {
      _sessionStore = processSnapshot(groupToken, snapshot);
      if (_sessionStore !== null) {
        callback(_sessionStore.data, _sessionStore.group);
      }
    });
};

const updateSession = (groupToken: string, payload: firestore.UpdateData) => {
  if (groupTokenValid(groupToken)) {
    throw new Error('shareToken undefined.');
  }

  getSessionStore(groupToken).then(store => {
    db()
      .collection('sessions')
      .doc(store.doc.id)
      .update(payload);
  });
};

export const startSession = (groupToken: string) => {
  updateSession(groupToken, { startDate: firestore.FieldValue.serverTimestamp() });
};

export const addSessionModerator = (groupToken: string, sid: string) => {
  updateSession(groupToken, { moderators: firestore.FieldValue.arrayUnion(sid) });
};

export const endSession = (groupToken: string) => {
  updateSession(groupToken, { endDate: firestore.FieldValue.serverTimestamp() });
};
