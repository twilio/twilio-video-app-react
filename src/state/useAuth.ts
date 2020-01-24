import { useCallback, useEffect, useState } from 'react';
import * as firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyD3HQ2F0OO1oQgkHxnHoqLEtUhL7laJcAE',
  authDomain: 'video-app-79418.firebaseapp.com',
  databaseURL: 'https://video-app-79418.firebaseio.com',
  storageBucket: 'video-app-79418.appspot.com',
  messagingSenderId: '285008367772',
};

export default function useAuth(setToken: any) {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [isAuthReady, setIsReady] = useState(false);

  useEffect(() => {
    if (process.env.REACT_APP_USE_FIREBASE_AUTH === 'true') {
      firebase.initializeApp(firebaseConfig);
      firebase.auth().onAuthStateChanged(user => {
        setUser(user);
        setIsReady(true);
      });
    }
  }, []);

  const signIn = useCallback(() => {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/plus.login');

    return firebase
      .auth()
      .signInWithPopup(provider)
      .then(user => {
        setUser(user.user);
      });
  }, []);

  const signOut = useCallback(() => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(null);
        setToken('');
      });
  }, [setToken]);

  return { user, signIn, signOut, isAuthReady };
}
