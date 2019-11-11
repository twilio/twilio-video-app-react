import { useEffect } from 'react';
import { Room } from 'twilio-video';
import { CallbackFunction } from '../../../types';

export default function useHandleOnDisconnect(room: Room, onDisconnect: CallbackFunction) {
  useEffect(() => {
    room.on('disconnected', onDisconnect);
    return () => {
      room.off('disconnected', onDisconnect);
    };
  }, [room, onDisconnect]);
}
