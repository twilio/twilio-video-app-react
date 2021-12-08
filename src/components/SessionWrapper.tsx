import useVideoContext from 'hooks/useVideoContext/useVideoContext';
import React, { ReactNode, useEffect } from 'react';
import { UserGroup } from 'types/UserGroup';
import { reactivateSession, startSession } from 'utils/firebase/session';
import useSessionContext from '../hooks/useSessionContext';
import { LoadingSpinner } from './LoadingSpinner';
import { PopupScreen } from './PopupScreen';
import { ISessionStatus } from './SessionProvider';

export const SessionWrapper = (props: { children: ReactNode }) => {
  const { sessionStatus, loading, userGroup, groupToken } = useSessionContext();
  const { room } = useVideoContext();

  useEffect(() => {
    if (!loading && sessionStatus !== ISessionStatus.SESSION_RUNNING && room) {
      room.disconnect();
    }
  }, [sessionStatus]);

  if (loading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  if (sessionStatus === ISessionStatus.SESSION_RUNNING) {
    return <>{props.children}</>;
  }

  if (sessionStatus === ISessionStatus.SESSION_NOT_STARTED) {
    return (
      <>
        <PopupScreen>
          <p>Dieser DemokraTisch beginnt in Kürze.</p>

          {userGroup === UserGroup.Moderator ? (
            <button className="bg-red text-white py-3 px-5 text-sm" onClick={() => startSession(groupToken as string)}>
              Jetzt Starten
            </button>
          ) : null}
        </PopupScreen>
      </>
    );
  }

  if (sessionStatus === ISessionStatus.SESSION_ENDED) {
    return (
      <PopupScreen>
        <span>Dieser DemokraTisch ist bereits beendet.</span>

        {userGroup === UserGroup.Moderator ? (
          <button
            className="bg-red text-white py-3 px-5 text-sm"
            onClick={() => reactivateSession(groupToken as string)}
          >
            DemokraTisch reaktivieren
          </button>
        ) : null}
      </PopupScreen>
    );
  }

  if (sessionStatus === ISessionStatus.SESSION_PAUSED) {
    return (
      <PopupScreen>
        <span>Dieser DemokraTisch ist aktuell pausiert.</span>
      </PopupScreen>
    );
  }

  return (
    <PopupScreen>
      <span>Der gewünschte DemokraTisch konnte nicht gefunden werden.</span>
    </PopupScreen>
  );
};
