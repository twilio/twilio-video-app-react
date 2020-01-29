import React, { createContext, useCallback, useContext, useState } from 'react';
import { TwilioError } from 'twilio-video';

interface StateContextType {
  error: TwilioError | null;
  setError(error: TwilioError | null): void;
  getToken(name: string, room: string): Promise<string>;
}

export const StateContext = createContext<StateContextType>(null!);

export default function AppStateProvider(props: React.PropsWithChildren<{}>) {
  const [error, setError] = useState<TwilioError | null>(null);
  const getToken = useCallback((name: string, roomName: string) => {
    return fetch(`/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, room: roomName }),
    })
      .then(res => res.json())
      .then(res => res.token);
  }, []);

  return <StateContext.Provider value={{ error, setError, getToken }}>{props.children}</StateContext.Provider>;
}

export function useAppState() {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useAppState must be used within the AppStateProvider');
  }
  return context;
}
