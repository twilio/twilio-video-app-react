import { useEffect } from 'react';
import { Room } from 'twilio-video';
import { Callback } from '../../../types';

export default function useHandleOnDisconnect(room: Room | null, onDisconnect: Callback) {
  useEffect(() => {
    if (room) {
      room.on('disconnected', onDisconnect);
      return () => {
        room.off('disconnected', onDisconnect);
      };
    }
  }, [room, onDisconnect]);
}
