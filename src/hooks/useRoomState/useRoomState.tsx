import { useEffect, useState } from 'react';
import useVideoContext from '../useVideoContext/useVideoContext';
import { ROOM_STATE } from '../../utils/displayStrings';

export default function useRoomState() {
  const { room } = useVideoContext();
  const [state, setState] = useState(ROOM_STATE.DISCONNECTED);

  useEffect(() => {
    const setRoomState = () => setState(room.state || ROOM_STATE.DISCONNECTED);
    setRoomState();
    room
      .on(ROOM_STATE.DISCONNECTED, setRoomState)
      .on(ROOM_STATE.RECONNECTED, setRoomState)
      .on(ROOM_STATE.RECONNECTING, setRoomState);
    return () => {
      room
        .off(ROOM_STATE.DISCONNECTED, setRoomState)
        .off(ROOM_STATE.RECONNECTED, setRoomState)
        .off(ROOM_STATE.RECONNECTING, setRoomState);
    };
  }, [room]);

  return state;
}
