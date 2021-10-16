import { ISession, ISessionLabels, UserGroup } from '../../types';
import { fetchSession, subscribeToSession } from '../../utils/firebase';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export enum ISessionStatus {
  SESSION_NOT_STARTED = 'SESSION_NOT_STARTED',
  SESSION_ENDED = 'SESSION_ENDED',
  SESSION_RUNNING = 'SESSION_RUNNING',
  SESSION_PAUSED = 'SESSION_PAUSED',
  AWAITING_STATUS = 'AWAITING_STATUS',
  NOT_FOUND = 'NOT_FOUND',
}

export interface ISessionContext {
  sessionToken: string | null;
  sessionStatus: ISessionStatus;
  userGroup: UserGroup | undefined;
  labels: ISessionLabels | undefined;
  sessionData: ISession | undefined;
  loading: boolean;
}

export const SessionContext = createContext<ISessionContext>(null!);

interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const { URLShareToken } = useParams() as { URLShareToken: string };

  const [loading, setLoading] = useState(true);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [sessionStatus, setSessionStatus] = useState<ISessionStatus>(ISessionStatus.AWAITING_STATUS);
  const [userGroup, setUserGroup] = useState<UserGroup>();
  const [labels, setLabels] = useState<ISessionLabels>();
  const [sessionData, setSessionData] = useState<ISession>();

  const onSessionData = (data: ISession, group: UserGroup) => {
    if (!data) {
      return;
    }

    console.log(data, Date.now());

    setLoading(false);
    if (data.isPaused) {
      setSessionStatus(ISessionStatus.SESSION_PAUSED);
    } else if (data.startDate.seconds > Date.now() / 1000) {
      setSessionStatus(ISessionStatus.SESSION_NOT_STARTED);
    } else if (data.endDate.seconds < Date.now() / 1000) {
      setSessionStatus(ISessionStatus.SESSION_ENDED);
    } else {
      setSessionStatus(ISessionStatus.SESSION_RUNNING);
    }

    setLabels(data.labels);
    setUserGroup(userGroup);
    setSessionData(data);
  };

  useEffect(() => {
    if (typeof URLShareToken === 'string' && URLShareToken.length !== 0) {
      fetchSession(URLShareToken)
        .then(dataAndGroup => {
          onSessionData(dataAndGroup.data, dataAndGroup.group);
          subscribeToSession(URLShareToken, onSessionData);
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
        sessionToken,
        sessionStatus,
        loading,
        userGroup,
        labels,
        sessionData,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
