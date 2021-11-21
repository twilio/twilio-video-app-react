import { ISession, ISessionResources, ISessionStore, ScreenType, UserGroup } from '../../types';
import React, { createContext, ReactNode, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { firestore } from 'firebase';
import { getSessionStore, subscribeToSessionStore, unsubscribeFromSessionStore } from 'utils/firebase/session';
import useVideoContext from 'hooks/useVideoContext/useVideoContext';
import { initSessionResources } from 'utils/resources';

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
  resources: ISessionResources;
  loading: boolean;
  groupToken: string | undefined;
  roomId: string | undefined;
  activeScreen: ScreenType | undefined;
  startDate: ISession['startDate'] | undefined;
  endDate: ISession['endDate'] | undefined;
  streamId: string | undefined;
  roomSid: string | undefined;
}

export const SessionContext = createContext<ISessionContext>(null!);

interface SessionProviderProps {
  children: ReactNode;
}

const updateDate = (prev: firestore.Timestamp | undefined, newDate: firestore.Timestamp | undefined) => {
  if (!prev || (newDate && prev && prev.isEqual(newDate) === false) || (!prev && !newDate)) {
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
  const [resources, setResources] = useState<ISessionResources>(initSessionResources(undefined));
  const [activeScreen, setActiveScreen] = useState<ScreenType>();
  const [startDate, setStartDate] = useState<ISession['startDate']>();
  const [endDate, setEndDate] = useState<ISession['endDate']>();
  const [streamId, setStreamId] = useState<string>();
  const [roomSid, setRoomSid] = useState<string>();
  const loadingRef = useRef<boolean>();
  loadingRef.current = loading;

  const onSessionStore = (store: ISessionStore) => {
    if (!store) {
      return;
    }

    if (loadingRef.current === true) {
      setResources(initSessionResources(store.data.resources));

      setLoading(false);
    }

    if (store.data.isPaused) {
      setSessionStatus(ISessionStatus.SESSION_PAUSED);
    } else if (
      store.data.startDate === undefined ||
      (store.data.startDate && store.data.startDate.toMillis() > firestore.Timestamp.now().toMillis())
    ) {
      setSessionStatus(ISessionStatus.SESSION_NOT_STARTED);
    } else if (store.data.hasEnded) {
      setSessionStatus(ISessionStatus.SESSION_ENDED);
    } else {
      setSessionStatus(ISessionStatus.SESSION_RUNNING);
    }

    setUserGroup(store.group);
    setRoomId(store.data.roomId);
    setActiveScreen(store.data.activeScreen);
    setStartDate(prev => updateDate(prev, store.data.startDate));
    setEndDate(prev => updateDate(prev, store.data.endDate));

    if (store.group === UserGroup.Audience) {
      setStreamId(store.data.streamId);
      setRoomSid(store.data.roomSid);
    }
  };

  useEffect(() => {
    const subId = 'sprov';

    if (typeof URLShareToken === 'string' && URLShareToken.length !== 0) {
      getSessionStore(URLShareToken)
        .then(store => {
          onSessionStore(store);
          subscribeToSessionStore(subId, URLShareToken, onSessionStore);
        })
        .catch(() => {
          setSessionStatus(ISessionStatus.NOT_FOUND);
          setLoading(false);
        });
    } else {
      setSessionStatus(ISessionStatus.NOT_FOUND);
      setLoading(false);
    }

    return () => {
      unsubscribeFromSessionStore(subId);
    };
  }, [URLShareToken]);

  return (
    <SessionContext.Provider
      value={{
        roomSid,
        sessionStatus,
        loading,
        userGroup,
        groupToken: URLShareToken,
        activeScreen,
        roomId,
        startDate,
        endDate,
        streamId,
        resources,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
});
