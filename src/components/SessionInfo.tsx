import { firestore } from 'firebase';
import useSessionContext from 'hooks/useSessionContext';
import React, { useState } from 'react';

const td = (x: number) => (x < 10 ? '0' + x : '' + x);

export const SessionInfo = () => {
  const { sessionData, labels } = useSessionContext();
  const [now, setNow] = useState(firestore.Timestamp.now().toMillis());

  const startDate = sessionData?.startDate.toDate();
  const endDate = sessionData?.endDate.toDate();

  const interval = setInterval(() => {
    setNow(firestore.Timestamp.now().toMillis());
  }, 1000 * 60);

  return (
    <div className="flex flex-col text-dark-blue space-y-3 items-end">
      <div className="flex items-center space-x-2 text-lg font-medium">
        <h1>{labels?.title}</h1>
        <span>·</span>
        <p>
          {startDate && endDate
            ? td(startDate.getHours()) +
              ':' +
              td(startDate.getMinutes()) +
              ' bis ' +
              td(endDate.getHours()) +
              ':' +
              td(endDate.getMinutes())
            : null}
        </p>
      </div>
      <div className="flex items-center space-x-3 text-purple text-base">
        <img src="/assets/clock.svg" alt="Uhr Icon" />

        {sessionData?.endDate && sessionData.endDate.toMillis() > firestore.Timestamp.now().toMillis() ? (
          <p>
            {sessionData?.endDate ? Math.floor((sessionData?.endDate.toMillis() - now) / 1000 / 60) : null}
            min verbleiben
          </p>
        ) : null}
      </div>
    </div>
  );
};
