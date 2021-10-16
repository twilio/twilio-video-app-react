import firebase, { firestore } from 'firebase';
import { ISession, UserGroup } from '../../types';

let _app: firebase.app.App, _userId: string, _session: { doc: any; userGroup: UserGroup };

export const firebaseApp = () =>
  new Promise<firebase.app.App>((resolve, reject) => {
    if (_app) {
      return resolve(_app);
    }

    const firebaseConfig = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG as string) as Object;

    resolve(firebase.initializeApp(firebaseConfig));
  });

export const db = () => firebase.firestore();

export const getUid = () =>
  new Promise<string>((resolve, reject) => {
    if (_userId) {
      return resolve(_userId);
    }

    firebaseApp().then(() => {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          var uid = user.uid;

          resolve(uid);
        } else {
          console.error('Firebase user undefined.');
        }
      });

      const auth = firebase
        .auth()
        .signInAnonymously()
        .catch(reject);
    });
  });

// export const getAuthIdToken = () =>
//   new Promise<string>((resolve, reject) => {
//     firebaseApp()
//       .then(() => {
//         const auth = getAuth();

//         function userOrSignin() {
//           if (auth.currentUser) return auth.currentUser;

//           return signInAnonymously(auth).then((identity) => identity.user);
//         }

//         Promise.resolve(userOrSignin())
//           .then(getIdToken)
//           .then((idToken) => resolve(idToken))
//           .catch((error) => reject(error));
//       })
//       .catch(reject);
//   });

const groupTokenValid = (groupToken: string) => {
  return typeof groupToken !== 'string' || groupToken.length === 0;
};

export const fetchSession = (groupToken: string) =>
  new Promise<{ data: ISession; group: UserGroup }>((resolve, reject) => {
    if (groupTokenValid(groupToken)) {
      throw new Error('shareToken undefined.');
    }

    db()
      .collection('sessions')
      .where('shareTokens.' + groupToken, '!=', null)
      .get()
      .then(snapshot => {
        const docs = snapshot.docs;
        if (snapshot.empty || !docs[0]) {
          return reject({ empty: true });
        }

        const data = docs[0].data() as ISession;
        resolve({ data, group: data.shareTokens[groupToken].toUpperCase() as UserGroup });
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
      const docs = snapshot.docs;
      if (snapshot.empty || !docs[0]) {
        return;
      }

      const data = docs[0].data() as ISession;
      callback(data, data.shareTokens[groupToken]);
    });
};
