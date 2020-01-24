import React, { createContext, useCallback, useContext, useState } from 'react';
import { TwilioError } from 'twilio-video';
import useAuth from './useAuth/useAuth';
import { User } from 'firebase';

interface StateContextType {
  token: string;
  error: TwilioError | null;
  setToken(token: string): void;
  setError(error: TwilioError | null): void;
  getToken(name: string, room: string): void;
  user: User | null;
  signIn(): Promise<void>;
  signOut(): Promise<void>;
  isAuthReady: boolean;
}

export const StateContext = createContext<StateContextType>(null!);

export async function getVideoServiceToken(name: string, roomName: string, user: User) {
  const idToken = await user!.getIdToken();
  return fetch(`https://app.video.bytwilio.com/api/v1/token?roomName=${roomName}&identity=${name}`, {
    method: 'GET',
    headers: { Authorization: idToken },
  }).then(res => res.text());
}

export function getLocalToken(name: string, roomName: string) {
  return fetch(`/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, room: roomName }),
  })
    .then(res => res.json())
    .then(res => res.token);
}

export default function AppStateProvider(props: React.PropsWithChildren<{}>) {
  const [token, setToken] = useState('');
  const [error, setError] = useState<TwilioError | null>(null);

  const { user, signIn, signOut, isAuthReady } = useAuth(setToken);

  const getToken = useCallback(
    (name, roomname) => {
      if (process.env.REACT_APP_USE_FIREBASE_AUTH === 'true') {
        getVideoServiceToken(name, roomname, user!)
          .then(setToken)
          .catch(setError);
      } else {
        getLocalToken(name, roomname)
          .then(setToken)
          .catch(setError);
      }
    },
    [setToken, user]
  );

  return (
    <StateContext.Provider value={{ token, error, setToken, setError, getToken, user, signIn, signOut, isAuthReady }}>
      {props.children}
    </StateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useAppState must be used within the AppStateProvider');
  }
  return context;
}
