import firebase, { firestore } from 'firebase';
import { ISession, UserGroup } from 'types';
import { db } from './base';

type Store = { data: ISession; group: UserGroup; doc: firestore.QueryDocumentSnapshot<firestore.DocumentData> };

let _sessionStore: Store | null;

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

export const subscribeToSession = (groupToken: string, callback: (data: ISession, userGroup: UserGroup) => void) => {
  if (groupTokenValid(groupToken)) {
    throw new Error('shareToken undefined.');
  }

  db()
    .collection('sessions')
    .where('shareTokens.' + groupToken, '!=', null)
    .onSnapshot(snapshot => {
      _sessionStore = processSnapshot(groupToken, snapshot);
      if (_sessionStore !== null) {
        callback(_sessionStore.data, _sessionStore.group);
      }
    });
};

export const startSession = (groupToken: string) => {
  if (groupTokenValid(groupToken)) {
    throw new Error('shareToken undefined.');
  }

  getSessionStore(groupToken).then(store => {
    const time = firestore.FieldValue.serverTimestamp();
    db()
      .collection('sessions')
      .doc(store.doc.id)
      .set(
        {
          startDate: time,
        },
        { merge: true }
      );
  });
};

export const addSessionModerator = (groupToken: string, sid: string) => {
  getSessionStore(groupToken).then(store => {
    db()
      .collection('sessions')
      .doc(store.doc.id)
      .update({
        moderators: firestore.FieldValue.arrayUnion(sid),
      });
  });
};
