import EventEmitter from 'events';
import { useEffect, useRef, useState } from 'react';
import Video, { ConnectOptions, LocalTrack, Room } from 'twilio-video';
import { Callback } from '../../../types';

export default function useRoom(
  localTracks: LocalTrack[],
  onError: Callback,
  token?: string,
  options?: ConnectOptions
) {
  const [room, setRoom] = useState<Room>(new EventEmitter() as Room);
  const [isConnecting, setIsConnecting] = useState(false);
  const disconnectHandlerRef = useRef<() => void>(() => {});

  useEffect(() => {
    // Connect to a room when we have a token, but not if a connection is in progress.
    if (token && room.state !== 'connected' && !isConnecting) {
      setIsConnecting(true);
      Video.connect(token, { ...options, tracks: [] }).then(
        newRoom => {
          setRoom(newRoom);

          newRoom.once('disconnected', () => {
            // Reset the room only after all other `disconnected` listeners have been called.
            setTimeout(() => setRoom(new EventEmitter() as Room));
          });

          // @ts-ignore
          window.twilioRoom = newRoom;

          localTracks.forEach(track =>
            // Tracks can be supplied as arguments to the Video.connect() function and they will automatically be published.
            // However, tracks must be published manually in order to set the priority on them.
            // All video tracks are published with 'low' priority. This works because the video
            // track that is displayed in the 'MainParticipant' component will have it's priority
            // set to 'high' via track.setPriority()
            newRoom.localParticipant.publishTrack(track, { priority: track.name === 'camera' ? 'low' : 'standard' })
          );

          disconnectHandlerRef.current = () => newRoom.disconnect();
          setIsConnecting(false);

          // Add a listener to disconnect from the room when a user closes their browser
          window.addEventListener('beforeunload', disconnectHandlerRef.current);
        },
        error => onError(error)
      );
    }

    return () => {
      if (room.state !== 'connected' && !isConnecting) {
        window.removeEventListener('beforeunload', disconnectHandlerRef.current);
      }
    };
  }, [token, options, room, localTracks, setIsConnecting, isConnecting, onError]);

  return { room, isConnecting };
}
