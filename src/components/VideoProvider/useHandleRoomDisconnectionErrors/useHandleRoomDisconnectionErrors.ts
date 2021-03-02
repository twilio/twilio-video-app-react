import { Room, TwilioError } from 'twilio-video';
import { useEffect } from 'react';

import { Callback } from '../../../types';

export default function useHandleRoomDisconnectionErrors(room: Room, onError: Callback) {
  useEffect(() => {
    const onDisconnected = (_: Room, error: TwilioError) => {
      if (error) {
        onError(error);
      }
    };

    room.on('disconnected', onDisconnected);
    return () => {
      room.off('disconnected', onDisconnected);
    };
  }, [room, onError]);
}
