import { Room, TwilioError } from 'twilio-video';
import { useEffect } from 'react';
import { ROOMSTATE } from '../../../utils/displayStrings';
import { Callback } from '../../../types';

export default function useHandleRoomDisconnectionErrors(room: Room, onError: Callback) {
  useEffect(() => {
    const onDisconnected = (room: Room, error: TwilioError) => {
      if (error) {
        onError(error);
      }
    };

    room.on(ROOMSTATE.DISCONNECTED, onDisconnected);
    return () => {
      room.off(ROOMSTATE.DISCONNECTED, onDisconnected);
    };
  }, [room, onError]);
}
