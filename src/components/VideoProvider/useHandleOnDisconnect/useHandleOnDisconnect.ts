import { useEffect } from 'react';
import { Room } from 'twilio-video';
import { Callback } from '../../../types';
import { ROOM_STATE } from '../../../utils/displayStrings';
export default function useHandleOnDisconnect(room: Room, onDisconnect: Callback) {
  useEffect(() => {
    room.on(ROOM_STATE.DISCONNECTED, onDisconnect);
    return () => {
      room.off(ROOM_STATE.DISCONNECTED, onDisconnect);
    };
  }, [room, onDisconnect]);
}
