import { Room, TwilioError } from 'twilio-video';
import { useEffect } from 'react';
import { ROOM_STATE } from '../../../utils/displayStrings';
import { Callback } from '../../../types';

export default function useHandleRoomDisconnectionErrors(room: Room, onError: Callback) {
  useEffect(() => {
    const onDisconnected = (room: Room, error: TwilioError) => {
      if (error) {
        onError(error);
      }
    };

    room.on(ROOM_STATE.DISCONNECTED, onDisconnected);
    return () => {
      room.off(ROOM_STATE.DISCONNECTED, onDisconnected);
    };
  }, [room, onError]);
}
