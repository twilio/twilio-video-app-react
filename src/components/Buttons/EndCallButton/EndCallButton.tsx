import useSessionContext from 'hooks/useSessionContext';
import React from 'react';
import { UserGroup } from 'types';
import { endSession } from 'utils/firebase/session';

import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

export default function EndCallButton(props: { className?: string }) {
  const { room } = useVideoContext();
  const { groupToken, userGroup } = useSessionContext();

  const onEndCall = () => {
    if (groupToken && userGroup === UserGroup.Moderator) {
      endSession(groupToken);
    }
    room!.disconnect();
  };

  return (
    <button
      onClick={onEndCall}
      className={'rounded-full bg-purple hover:shadow-xl p-5 transition-all duration-500'}
      data-cy-disconnect
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z"
        />
      </svg>
    </button>
  );
}
