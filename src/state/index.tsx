import React, { createContext, useCallback, useContext, useState } from 'react';
import { TwilioError } from 'twilio-video';
import useAuth from './useAuth/useAuth';
import { User } from 'firebase';

interface StateContextType {
  error: TwilioError | null;
  setError(error: TwilioError | null): void;
  getToken(name: string, room: string): Promise<string>;
  user: User | null;
  signIn(): Promise<void>;
  signOut(): Promise<void>;
  isAuthReady: boolean;
}

export const StateContext = createContext<StateContextType>(null!);

export default function AppStateProvider(props: React.PropsWithChildren<{}>) {
  const [error, setError] = useState<TwilioError | null>(null);

  const { user, signIn, signOut, isAuthReady } = useAuth();

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
        .then(res => res.text(), setError)
        .catch(error => {
          setError(error);
          return error;
        });
    },
    [user]
  );

  return (
    <StateContext.Provider value={{ error, setError, getToken, user, signIn, signOut, isAuthReady }}>
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
