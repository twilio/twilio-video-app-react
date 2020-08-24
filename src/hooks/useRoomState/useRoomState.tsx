import { useEffect, useState } from 'react';
import useVideoContext from '../useVideoContext/useVideoContext';
import { ROOMSTATE } from '../../utils/displayStrings';

export default function useRoomState() {
  const { room } = useVideoContext();
  const [state, setState] = useState(ROOMSTATE.DISCONNECTED);

  useEffect(() => {
    const setRoomState = () => setState(room.state || ROOMSTATE.DISCONNECTED);
    setRoomState();
    room
      .on(ROOMSTATE.DISCONNECTED, setRoomState)
      .on(ROOMSTATE.RE_CONNECTED, setRoomState)
      .on(ROOMSTATE.RECONNECTING, setRoomState);
    return () => {
      room
        .off(ROOMSTATE.DISCONNECTED, setRoomState)
        .off(ROOMSTATE.RE_CONNECTED, setRoomState)
        .off(ROOMSTATE.RECONNECTING, setRoomState);
    };
  }, [room]);

  return state;
}
