import EventEmitter from 'events';
import { useEffect, useRef, useState } from 'react';
import Video, { ConnectOptions, LocalTrack, Room } from 'twilio-video';

export default function useRoom(localTracks: LocalTrack[], token?: string, options?: ConnectOptions) {
  const [room, setRoom] = useState<Room>(new EventEmitter() as Room);
  const [isConnecting, setIsConnecting] = useState(false);
  const disconnectHandlerRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (token && room.state !== 'connected' && !isConnecting) {
      setIsConnecting(true);
      Video.connect(token, { ...options, tracks: [] }).then(newRoom => {
        setRoom(newRoom);
        localTracks.forEach(track =>
          // Publishing here so we can set the track priority
          newRoom.localParticipant.publishTrack(track, { priority: track.name === 'camera' ? 'low' : 'standard' })
        );

        disconnectHandlerRef.current = () => newRoom.disconnect();
        setIsConnecting(false);
        window.addEventListener('beforeunload', disconnectHandlerRef.current);
      });
    }

    return () => {
      if (room.state === 'connected' && !isConnecting) {
        room.disconnect();
        window.removeEventListener('beforeunload', disconnectHandlerRef.current);
      }
    };
  }, [token, options, room, localTracks, setIsConnecting, isConnecting]);

  return { room, isConnecting };
}
