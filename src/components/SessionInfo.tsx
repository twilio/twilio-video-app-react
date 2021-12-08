import { firestore } from 'firebase';
import useLanguageContext from 'hooks/useLanguageContext';
import useSessionContext from 'hooks/useSessionContext';
import React, { useState } from 'react';
import { LANGUAGE_CODE } from 'types/Language';

const td = (x: number) => (x < 10 ? '0' + x : '' + x);

export const SessionInfo = () => {
  const { startDate, endDate, resources } = useSessionContext();
  const { langCode } = useLanguageContext();
  const [now, setNow] = useState(firestore.Timestamp.now().toMillis());

  const start = startDate?.toDate();
  const end = endDate?.toDate();

  const interval = setInterval(() => {
    setNow(firestore.Timestamp.now().toMillis());
  }, 1000 * 60);

  const localTimeString = (date: Date) => {
    return date.toLocaleTimeString(langCode, { hour: 'numeric', minute: 'numeric' }).toLowerCase();
  };

  return (
    <div className="flex text-dark-blue items-center w-full justify-center space-x-10">
      <div className="flex items-center space-x-2 text-base font-medium whitespace-nowrap">
        {/* <h1>{resources.title}</h1>
        <span>·</span> */}
        <p>
          {start && end
            ? `${localTimeString(start)} ${langCode === LANGUAGE_CODE.de_DE ? 'bis' : 'until'} ${localTimeString(end)}`
            : null}
        </p>
      </div>
      {endDate && endDate.toMillis() > firestore.Timestamp.now().toMillis() ? (
        <div className="flex items-center space-x-3 text-purple text-sm whitespace-nowrap">
          <img src="/assets/clock.svg" alt="Uhr Icon" />
          <p>
            {endDate ? Math.round((endDate.toMillis() - now) / 1000 / 60) : null} min{' '}
            {langCode === LANGUAGE_CODE.de_DE ? 'verbleiben' : 'remaining'}
          </p>
        </div>
      ) : null}
    </div>
  );
};
