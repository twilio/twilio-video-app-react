import { ISession, ISessionLabels, ISessionStore, ScreenType, UserGroup } from '../../types';
import React, { createContext, ReactNode, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { firestore } from 'firebase';
import { getSessionStore, subscribeToSessionStore } from 'utils/firebase/session';

export enum ISessionStatus {
  SESSION_NOT_STARTED = 'SESSION_NOT_STARTED',
  SESSION_ENDED = 'SESSION_ENDED',
  SESSION_RUNNING = 'SESSION_RUNNING',
  SESSION_PAUSED = 'SESSION_PAUSED',
  AWAITING_STATUS = 'AWAITING_STATUS',
  NOT_FOUND = 'NOT_FOUND',
}

export interface ISessionContext {
  sessionStatus: ISessionStatus;
  userGroup: UserGroup | undefined;
  labels: ISessionLabels | undefined;
  loading: boolean;
  groupToken: string | undefined;
  roomId: string | undefined;
  activeScreen: ScreenType | undefined;
  startDate: ISession['startDate'] | undefined;
  endDate: ISession['endDate'] | undefined;
}

export const SessionContext = createContext<ISessionContext>(null!);

interface SessionProviderProps {
  children: ReactNode;
}

const updateDate = (prev: firestore.Timestamp | undefined, newDate: firestore.Timestamp) => {
  if (prev && prev?.isEqual(newDate) === false) {
    console.log('new date');
    return newDate;
  } else {
    return prev;
  }
};

export const SessionProvider = React.memo(({ children }: SessionProviderProps) => {
  const { URLShareToken } = useParams() as { URLShareToken: string };

  const [loading, setLoading] = useState(true);
  const [sessionStatus, setSessionStatus] = useState<ISessionStatus>(ISessionStatus.AWAITING_STATUS);
  const [userGroup, setUserGroup] = useState<UserGroup>();
  const [roomId, setRoomId] = useState<string>();
  const [labels, setLabels] = useState<ISessionLabels>();
  const [activeScreen, setActiveScreen] = useState<ScreenType>();
  const [startDate, setStartDate] = useState<ISession['startDate']>();
  const [endDate, setEndDate] = useState<ISession['endDate']>();
  const loadingRef = useRef<boolean>();
  loadingRef.current = loading;

  const onSessionStore = (store: ISessionStore) => {
    if (!store) {
      return;
    }

    if (loadingRef.current === true) {
      //only at the inital fetch
      console.log('update labels');
      setLabels(store.data.labels);
      setLoading(false);
    }

    if (store.data.isPaused) {
      setSessionStatus(ISessionStatus.SESSION_PAUSED);
    } else if (
      store.data.startDate !== null &&
      store.data.startDate.toMillis() > firestore.Timestamp.now().toMillis()
    ) {
      setSessionStatus(ISessionStatus.SESSION_NOT_STARTED);
    } else if (store.data.endDate !== null && store.data.endDate.toMillis() < firestore.Timestamp.now().toMillis()) {
      setSessionStatus(ISessionStatus.SESSION_ENDED);
    } else {
      setSessionStatus(ISessionStatus.SESSION_RUNNING);
    }

    setUserGroup(store.group);
    setRoomId(store.data.roomId);
    setActiveScreen(store.data.activeScreen);
    setStartDate(prev => updateDate(prev, store.data.startDate));
    setEndDate(prev => updateDate(prev, store.data.startDate));
  };

  useEffect(() => {
    if (typeof URLShareToken === 'string' && URLShareToken.length !== 0) {
      getSessionStore(URLShareToken)
        .then(store => {
          onSessionStore(store);
          subscribeToSessionStore('sprov', URLShareToken, onSessionStore);
        })
        .catch(() => {
          setSessionStatus(ISessionStatus.NOT_FOUND);
          setLoading(false);
        });
    } else {
      setSessionStatus(ISessionStatus.NOT_FOUND);
      setLoading(false);
    }
  }, [URLShareToken]);

  return (
    <SessionContext.Provider
      value={{
        sessionStatus,
        loading,
        userGroup,
        labels,
        groupToken: URLShareToken,
        activeScreen,
        roomId,
        startDate,
        endDate,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
});
