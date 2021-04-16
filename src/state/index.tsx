import React, { createContext, useContext, useReducer, useState } from 'react';
import { RecordingRules, RoomType } from '../types';
import { TwilioError } from 'twilio-video';
import { settingsReducer, initialSettings, Settings, SettingsAction } from './settings/settingsReducer';
import useActiveSinkId from './useActiveSinkId/useActiveSinkId';
import useFirebaseAuth from './useFirebaseAuth/useFirebaseAuth';
import usePasscodeAuth from './usePasscodeAuth/usePasscodeAuth';
import { User } from 'firebase';
import * as api from './apiUtils/apiUtils';

export interface StateContextType {
  error: TwilioError | Error | null;
  setError(error: TwilioError | Error | null): void;
  getToken(name: string, room: string, passcode?: string): Promise<string>;
  user?: User | null | { displayName: undefined; photoURL: undefined; passcode?: string };
  signIn?(passcode?: string): Promise<void>;
  signOut?(): Promise<void>;
  isAuthReady?: boolean;
  isFetching: boolean;
  activeSinkId: string;
  setActiveSinkId(sinkId: string): void;
  settings: Settings;
  dispatchSetting: React.Dispatch<SettingsAction>;
  roomType?: RoomType;
  updateRecordingRules(room_sid: string, rules: RecordingRules): Promise<object>;
}

export const StateContext = createContext<StateContextType>(null!);

/*
  The 'react-hooks/rules-of-hooks' linting rules prevent React Hooks from being called
  conditionally. This is because hooks must always be called in the same order
  every time a component is rendered. The 'react-hooks/rules-of-hooks' rule is disabled below
  because the "if (process.env.REACT_APP_SET_AUTH === 'firebase')" statements are evaluated
  at build time, not runtime. If the statement evaluates to false, then the code is not
  included in the bundle that is produced (due to tree-shaking). Thus, in this instance, it
  is ok to call hooks inside if() statements.
*/
export default function AppStateProvider(props: React.PropsWithChildren<{}>) {
  const [error, setError] = useState<TwilioError | Error | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [activeSinkId, setActiveSinkId] = useActiveSinkId();
  const [settings, dispatchSetting] = useReducer(settingsReducer, initialSettings);
  const [roomType, setRoomType] = useState<RoomType>();

  let isAuthReady, signIn, signOut, user;

  if (process.env.REACT_APP_SET_AUTH === 'firebase') {
    ({ isAuthReady, signIn, signOut, user } = useFirebaseAuth()); // eslint-disable-line react-hooks/rules-of-hooks
  }

  if (process.env.REACT_APP_SET_AUTH === 'passcode') {
    ({ isAuthReady, signIn, signOut, user } = usePasscodeAuth()); // eslint-disable-line react-hooks/rules-of-hooks
  }

  function getToken(user_identity: string, room_name: string) {
    setIsFetching(true);
    return api
      .getToken(user_identity, room_name)
      .then(res => {
        setRoomType(res.data.roomType);
        return res.data.token;
      })
      .finally(() => setIsFetching(false));
  }

  function updateRecordingRules(room_sid: string, rules: RecordingRules) {
    setIsFetching(true);
    return api.updateRecordingRules(room_sid, rules).finally(() => setIsFetching(false));
  }

  return (
    <StateContext.Provider
      value={{
        getToken,
        updateRecordingRules,
        roomType,
        settings,
        dispatchSetting,
        isFetching,
        activeSinkId,
        setActiveSinkId,
        isAuthReady,
        signIn,
        signOut,
        user,
        error,
        setError,
      }}
    >
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
