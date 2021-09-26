import firebase from 'firebase';

const {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_STORAGE_BUCKET,
  FIREASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
} = process.env;

var firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: 'demokratisch-3adf0',
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
};

let instance: any;

export default function getFirebase() {
  if (typeof window !== 'undefined') {
    if (instance) return instance;
    instance = firebase.initializeApp(firebaseConfig);
    return instance;
  }

  return null;
}
