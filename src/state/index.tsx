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

export default function AppStateProvider(props: React.PropsWithChildren<{}>) {
  const [token, setToken] = useState('');
  const [error, setError] = useState<TwilioError | null>(null);

  const { user, signIn, signOut, isAuthReady } = useAuth(setToken);

  const getToken = useCallback(
    async (identity, roomName) => {
      const headers = new window.Headers();

      if (process.env.REACT_APP_USE_FIREBASE_AUTH === 'true') {
        const idToken = await user!.getIdToken();
        headers.set('Authorization', idToken);
      }

      const endpoint = process.env.REACT_APP_TOKEN_ENDPOINT || '/token';
      const params = new window.URLSearchParams({ identity, roomName });

      return fetch(`${endpoint}?${params}`, { headers })
        .then(res => res.text())
        .then(setToken)
        .catch(setError);
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
