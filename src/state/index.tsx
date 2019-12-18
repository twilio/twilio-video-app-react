import React, { createContext, useCallback, useContext, useState } from 'react';
import { TwilioError } from 'twilio-video';

interface StateContextType {
  token: string;
  error: TwilioError | null;
  setToken(token: string): void;
  setError(error: TwilioError | null): void;
  getToken(name: string, room: string): void;
}

export const StateContext = createContext<StateContextType>(null!);

export default function AppStateProvider(props: React.PropsWithChildren<{}>) {
  const [token, setToken] = useState('');
  const [error, setError] = useState<TwilioError | null>(null);
  const getToken = useCallback(
    (name: string, roomName: string) => {
      return fetch(`/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, room: roomName }),
      })
        .then(res => res.json())
        .then(res => setToken(res.token));
    },
    [setToken]
  );

  return (
    <StateContext.Provider value={{ token, error, setToken, setError, getToken }}>
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
