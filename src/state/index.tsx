import React, { createContext, useContext, useReducer, useState } from 'react';
import { RoomType } from '../types';
import { TwilioError } from 'twilio-video';
import { settingsReducer, initialSettings, Settings, SettingsAction } from './settings/settingsReducer';
import useActiveSinkId from './useActiveSinkId/useActiveSinkId';

export interface StateContextType {
  error: TwilioError | Error | null;
  setError(error: TwilioError | Error | null): void;
  user?: { displayName: undefined; photoURL: undefined; participantID: undefined, userType: undefined };
  token?: string
  roomName?: string
  roomEndTime?: string
  appointmentID?: number
  activeSinkId: string;
  setActiveSinkId(sinkId: string): void;
  settings: Settings;
  dispatchSetting: React.Dispatch<SettingsAction>;
  roomType?: RoomType;
  test: boolean;
}

export const StateContext = createContext<StateContextType>(null!);

/*
  The 'react-hooks/rules-of-hooks' linting rules prevent React Hooks from being called
  inside of if() statements. This is because hooks must always be called in the same order
  every time a component is rendered. The 'react-hooks/rules-of-hooks' rule is disabled below
  because the "if (process.env.REACT_APP_SET_AUTH === 'firebase')" statements are evaluated
  at build time (not runtime). If the statement evaluates to false, then the code is not
  included in the bundle that is produced (due to tree-shaking). Thus, in this instance, it
  is ok to call hooks inside if() statements.
*/
export default function AppStateProvider(props: React.PropsWithChildren<{}>) {
  const [error, setError] = useState<TwilioError | null>(null);
  const [user] = useState({ displayName: props.userName, photoURL: props.userAvatar, participantID: props.participantID, userType: props.userType });
  const [appointmentID] = useState(props.appointmentID);
  const [token] = useState(props.token);
  const [roomName] = useState(props.roomName);
  const [roomEndTime] = useState(props.roomEndTime);
  const [test] = useState(props.test);
  const [activeSinkId, setActiveSinkId] = useActiveSinkId();
  const [settings, dispatchSetting] = useReducer(settingsReducer, initialSettings);
  const [roomType] = useState<RoomType>('go');

  let contextValue = {
    error,
    user,
    token,
    roomName,
    roomEndTime,
    setError,
    activeSinkId,
    setActiveSinkId,
    settings,
    dispatchSetting,
    appointmentID,
    roomType,
    test,
  } as StateContextType;
  return <StateContext.Provider value={{ ...contextValue }}>{props.children}</StateContext.Provider>;
}

export function useAppState() {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useAppState must be used within the AppStateProvider');
  }
  return context;
}
