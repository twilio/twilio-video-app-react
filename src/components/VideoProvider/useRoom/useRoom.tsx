import { Callback } from '../../../types'
import { isMobile } from '../../../utils';
import Video, { ConnectOptions, LocalTrack, Room } from 'twilio-video';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppState } from '../../../state';
import updateParticipantFailed from '../../../utils/ParticipantStatus/updateParticipantFailed';
import redirectRootPath from '../../../utils/redirectRootPath'

// @ts-ignore
window.TwilioVideo = Video;

export default function useRoom(localTracks: LocalTrack[], onError: Callback, options?: ConnectOptions) {
  const [room, setRoom] = useState<Room | null>(null);
  const { appointmentID, user } = useAppState();
  const [isConnecting, setIsConnecting] = useState(false);
  const optionsRef = useRef(options);

  useEffect(() => {
    // This allows the connect function to always access the most recent version of the options object. This allows us to
    // reliably use the connect function at any time.
    optionsRef.current = options;
  }, [options]);

  const connect = useCallback(
    token => {
      setIsConnecting(true);
      return Video.connect(token, { ...optionsRef.current, tracks: localTracks }).then(
        newRoom => {
          setRoom(newRoom);
          const disconnect = () => newRoom.disconnect();

          // This app can add up to 13 'participantDisconnected' listeners to the room object, which can trigger
          // a warning from the EventEmitter object. Here we increase the max listeners to suppress the warning.
          newRoom.setMaxListeners(15);

          newRoom.once('disconnected', () => {
            // Reset the room only after all other `disconnected` listeners have been called.
            setTimeout(() => setRoom(null));
            document.removeEventListener('turbolinks:before-cache', disconnect);

            if (isMobile) {
              window.removeEventListener('pagehide', disconnect);
            }
            // Hard redirect to appointment view
            redirectRootPath();
          });

          // @ts-ignore
          window.twilioRoom = newRoom;

          newRoom.localParticipant.videoTracks.forEach(publication =>
            // All video tracks are published with 'low' priority because the video track
            // that is displayed in the 'MainParticipant' component will have it's priority
            // set to 'high' via track.setPriority()
            publication.setPriority('low')
          );

          setIsConnecting(false);
          // turbolinks
          window.addEventListener('turbolinks:before-cache', disconnect)
          // Add a listener to disconnect from the room when a user closes their browser

          if (isMobile) {
            // Add a listener to disconnect from the room when a mobile user closes their browser
            window.addEventListener('pagehide', disconnect);
          }
        },
        error => {
          onError(error);
          updateParticipantFailed(appointmentID, user.participantID, error);
          setIsConnecting(false);
        }
      );
    },
    [localTracks, onError]
  );

  return { room, isConnecting, connect };
}
