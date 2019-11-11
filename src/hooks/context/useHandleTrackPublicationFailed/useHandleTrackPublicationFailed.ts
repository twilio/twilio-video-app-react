import { Room } from 'twilio-video';
import { useEffect } from 'react';

import { CallbackFunction } from '../../../types';

export default function useHandleTrackPublicationFailed(room: Room, onError: CallbackFunction) {
  const { localParticipant } = room;
  useEffect(() => {
    if (localParticipant) {
      localParticipant.on('trackPublicationFailed', onError);
      return () => {
        localParticipant.off('trackPublicationFailed', onError);
      };
    }
  }, [localParticipant, onError]);
}
