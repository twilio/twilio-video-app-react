import { firestore } from 'firebase';
import useSessionContext from 'hooks/useSessionContext';
import React, { useState } from 'react';

const td = (x: number) => (x < 10 ? '0' + x : '' + x);

export const SessionInfo = () => {
  const { startDate, endDate, labels } = useSessionContext();
  const [now, setNow] = useState(firestore.Timestamp.now().toMillis());

  const start = startDate?.toDate();
  const end = endDate?.toDate();

  const interval = setInterval(() => {
    setNow(firestore.Timestamp.now().toMillis());
  }, 1000 * 60);

  return (
    <div className="flex flex-col text-dark-blue space-y-3 items-end">
      <div className="flex items-center space-x-2 text-lg font-medium">
        <h1>{labels?.title}</h1>
        <span>·</span>
        <p>
          {start && end
            ? td(start.getHours()) +
              ':' +
              td(start.getMinutes()) +
              ' bis ' +
              td(end.getHours()) +
              ':' +
              td(end.getMinutes())
            : null}
        </p>
      </div>
      {endDate && endDate.toMillis() > firestore.Timestamp.now().toMillis() ? (
        <div className="flex items-center space-x-3 text-purple text-base">
          <img src="/assets/clock.svg" alt="Uhr Icon" />

          <p>
            {endDate ? Math.round((endDate.toMillis() - now) / 1000 / 60) : null}
            min verbleiben
          </p>
        </div>
      ) : null}
    </div>
  );
};
