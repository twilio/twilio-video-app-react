import EventEmitter from 'events';
import { useEffect, useState } from 'react';
import Video, { ConnectOptions, LocalTrack, Room } from 'twilio-video';

export default function useRoom(
  localTracks: LocalTrack[],
  token?: string,
  options?: ConnectOptions
) {
  const [room, setRoom] = useState<Room>(new EventEmitter() as Room);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const handleBeforeunload = () => room.disconnect();

    if (token && room.state !== 'connected') {
      setIsConnecting(true);
      Video.connect(token, { tracks: localTracks, ...options }).then(room => {
        setRoom(room);
        setIsConnecting(false);
        window.addEventListener('beforeunload', handleBeforeunload);
      });
    }

    return () => {
      if (room.state === 'connected') {
        room.disconnect();
        window.removeEventListener('beforeunload', handleBeforeunload);
      }
    };
  }, [token, options, room, localTracks, setIsConnecting]);

  return { room, isConnecting };
}
