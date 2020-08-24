import { useEffect } from 'react';
import { Room } from 'twilio-video';
import { Callback } from '../../../types';
import { ROOMSTATE } from '../../../utils/displayStrings';
export default function useHandleOnDisconnect(room: Room, onDisconnect: Callback) {
  useEffect(() => {
    room.on(ROOMSTATE.DISCONNECTED, onDisconnect);
    return () => {
      room.off(ROOMSTATE.DISCONNECTED, onDisconnect);
    };
  }, [room, onDisconnect]);
}
