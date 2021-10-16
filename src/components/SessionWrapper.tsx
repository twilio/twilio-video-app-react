import React from 'react';
import { ReactNode } from 'react-transition-group/node_modules/@types/react';
import useSessionContext from '../hooks/useSessionContext';
import { LoadingSpinner } from './LoadingSpinner';
import { ISessionStatus } from './SessionProvider';

export const SessionWrapper = (props: { children: ReactNode }) => {
  const { sessionStatus, loading } = useSessionContext();

  if (loading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  if (sessionStatus === ISessionStatus.SESSION_RUNNING) {
    return <>{props.children}</>;
  }

  if (sessionStatus === ISessionStatus.SESSION_NOT_STARTED) {
    return (
      <>
        <div className="w-full h-screen flex justify-center items-center">
          <div className="flex flex-col items-center space-y-8">
            <p className="text-2xl text-center leading-relaxed font-bold">Dieser DemokraTisch beginnt in Kürze.</p>
            <div
              style={{ borderTopColor: 'transparent' }}
              className="w-12 h-12 border-4 border-primary border-solid rounded-full animate-spin"
            />
          </div>
        </div>
      </>
    );
  }

  if (sessionStatus === ISessionStatus.SESSION_ENDED) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="flex flex-col items-center justify-center space-y-8">
          <p className="text-2xl text-center leading-relaxed font-bold">Dieser DemokraTisch ist bereits beendet.</p>
        </div>
      </div>
    );
  }

  if (sessionStatus === ISessionStatus.SESSION_PAUSED) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="flex flex-col items-center justify-center space-y-8">
          <p className="text-2xl text-center leading-relaxed font-bold">Dieser DemokraTisch ist aktuell pausiert.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <p className="text-2xl text-center leading-relaxed font-bold">
        Der gewünschte DemokraTisch konnte nicht gefunden werden.
      </p>
    </div>
  );
};
