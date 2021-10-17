import firebase from 'firebase';

const {
  REACT_APP_FIREBASE_API_KEY,
  REACT_APP_FIREBASE_AUTH_DOMAIN,
  REACT_APP_FIREBASE_STORAGE_BUCKET,
  REACT_APP_FIREASE_MESSAGING_SENDER_ID,
  REACT_APP_FIREBASE_APP_ID,
} = process.env;

var firebaseConfig = {
  apiKey: REACT_APP_FIREBASE_API_KEY,
  authDomain: REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: 'demokratisch-3adf0',
  storageBucket: REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: REACT_APP_FIREASE_MESSAGING_SENDER_ID,
  appId: REACT_APP_FIREBASE_APP_ID,
};

let _app: firebase.app.App, _userId: string;

export const getFirebase = () => {
  if (_app) {
    return _app;
  }

  _app = firebase.initializeApp(firebaseConfig);
  return _app;
};

export const db = () => firebase.firestore();

export const getUid = () =>
  new Promise<string>((resolve, reject) => {
    if (_userId) {
      return resolve(_userId);
    }

    getFirebase();

    firebase
      .auth()
      .signInAnonymously()
      .then(data => {
        if (data.user) {
          _userId = data.user?.uid;
          resolve(_userId);
        }
      })
      .catch(reject);
  });
