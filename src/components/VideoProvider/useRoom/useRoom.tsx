import { Callback } from '../../../types';
import EventEmitter from 'events';
import { isMobile } from '../../../utils';
import Video, {
  ConnectOptions,
  LocalDataTrack,
  LocalTrack,
  RemoteDataTrackPublication,
  RemoteParticipant,
  Room,
} from 'twilio-video';
import { useCallback, useEffect, useRef, useState } from 'react';

// @ts-ignore
window.TwilioVideo = Video;

export default function useRoom(localTracks: LocalTrack[], onError: Callback, options?: ConnectOptions) {
  const [room, setRoom] = useState<Room>(new EventEmitter() as Room);
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

      // Add a LocalDataTrack for sharing VideoTrack subscription information.
      const videoSubscriptionSignaling = new LocalDataTrack({ name: 'video_subscription_signaling' });
      localTracks.push(videoSubscriptionSignaling);

      return Video.connect(token, { ...optionsRef.current, tracks: localTracks }).then(
        newRoom => {
          setRoom(newRoom);
          const disconnect = () => newRoom.disconnect();

          newRoom.once('disconnected', () => {
            // Reset the room only after all other `disconnected` listeners have been called.
            setTimeout(() => setRoom(new EventEmitter() as Room));
            window.removeEventListener('beforeunload', disconnect);

            if (isMobile) {
              window.removeEventListener('pagehide', disconnect);
            }
          });

          // @ts-ignore
          window.twilioRoom = newRoom;
          const [pc] = [...(newRoom as any)._signaling._peerConnectionManager._peerConnections.values()].map(
            pcv2 => pcv2._peerConnection
          );
          let videoSubscriptionPriorities: any = {};

          // Initially, don't send any video bytes until at least one Participant
          // joins the Room.
          updateVideoSubscription();

          newRoom.localParticipant.videoTracks.forEach((publication: any) =>
            // Tracks can be supplied as arguments to the Video.connect() function and they will automatically be published.
            // However, tracks must be published manually in order to set the priority on them.
            // All video tracks are published with 'low' priority. This works because the video
            // track that is displayed in the 'MainParticipant' component will have it's priority
            // set to 'high' via track.setPriority()
            publication.setPriority('low')
          );

          // Build a list of subscription signaling channels published by the Room's
          // RemoteParticipants.
          let videoSubscriptionSignalings = new Map();
          [...newRoom.participants.values()].forEach(participant => {
            const videoSubscriptionSignaling = [...participant.dataTracks.values()].find(publication => {
              return publication.track && publication.trackName === 'video_subscription_signaling';
            });
            if (videoSubscriptionSignaling) {
              videoSubscriptionSignalings.set(participant, videoSubscriptionSignaling);
            }
          });

          // Send video subscription updates to other Participants in the Room.
          sendVideoSubscriptionUpdate();

          videoSubscriptionSignalings.forEach((publication, participant) =>
            videoSubscriptionSignalingSubscribed(publication as RemoteDataTrackPublication, participant)
          );

          newRoom.on('trackSubscribed', (track, publication, participant) => {
            if (track.kind === 'data' && track.name === 'video_subscription_signaling') {
              videoSubscriptionSignalingSubscribed(publication, participant);
            } else if (track.kind === 'video') {
              sendVideoSubscriptionUpdate();
            }
          });

          newRoom.on('trackUnsubscribed', (track, publication, participant) => {
            if (track.kind === 'data' && track.name === 'video_subscription_signaling') {
              delete videoSubscriptionPriorities[participant.identity];
              videoSubscriptionSignalings.delete(participant);
            } else if (track.kind === 'video') {
              sendVideoSubscriptionUpdate();
            }
          });

          newRoom.on('dominantSpeakerChanged', sendVideoSubscriptionUpdate);
          newRoom.on('trackSwitchedOff', track => track.kind === 'video' && sendVideoSubscriptionUpdate());
          newRoom.on('trackSwitchedOn', track => track.kind === 'video' && sendVideoSubscriptionUpdate());

          setIsConnecting(false);

          // Add a listener to disconnect from the room when a user closes their browser
          window.addEventListener('beforeunload', disconnect);

          if (isMobile) {
            // Add a listener to disconnect from the room when a mobile user closes their browser
            window.addEventListener('pagehide', disconnect);
          }

          function videoSubscriptionSignalingSubscribed(
            publication: RemoteDataTrackPublication,
            participant: RemoteParticipant
          ) {
            videoSubscriptionSignalings.set(participant, publication);
            sendVideoSubscriptionUpdate();
            publication.track!.on('message', (message: string) => {
              const json = JSON.parse(message);
              if (newRoom.localParticipant.identity in json) {
                console.log('Incoming:', { [participant.identity]: json[newRoom.localParticipant.identity] });
                updateVideoSubscription(participant.identity, json[newRoom.localParticipant.identity]);
              }
            });
          }

          function sendVideoSubscriptionUpdate() {
            const update: any = {};
            videoSubscriptionSignalings.forEach((signaling, participant) => {
              const [{ publishPriority, track }] = [...participant.videoTracks.values()];
              let priority = 'high';
              if (!track || track.isSwitchedOff) {
                priority = 'off';
              } else if (participant === newRoom.dominantSpeaker) {
                priority = optionsRef.current!.bandwidthProfile!.video!.dominantSpeakerPriority as string;
              } else if (track) {
                priority = (track.priority || publishPriority) as string;
              }
              update[participant.identity] = priority;
            });
            console.log('Outgoing:', update);
            videoSubscriptionSignaling.send(JSON.stringify(update));
          }

          function updateVideoSubscription(participantIdentity?: string, priority?: string) {
            if (participantIdentity) {
              videoSubscriptionPriorities[participantIdentity] = priority;
            }

            const maxPriority = Object.values(videoSubscriptionPriorities).reduce((maxPriority, priority) => {
              const rank = ['off', 'low', 'standard', 'high'];
              return rank.indexOf(maxPriority as string) < rank.indexOf(priority as string)
                ? (priority as string)
                : (maxPriority as string);
            }, 'off');

            const onSignalingStateStable = () => {
              const videoSenders = pc
                .getSenders()
                .filter(({ track }: { track: any }) => track && track.kind === 'video');
              videoSenders.forEach((sender: any) => {
                const params = sender.getParameters();
                if (maxPriority === 'off') {
                  params.encodings.forEach((encoding: any) => (encoding.active = false));
                } else {
                  const layerIdx = ['low', 'standard', 'high'].indexOf(maxPriority as string);
                  params.encodings.forEach((encoding: any, i: number) => (encoding.active = i <= layerIdx));
                }
                console.log('Priorities:', Object.values(videoSubscriptionPriorities));
                console.log(
                  'Encodings:',
                  maxPriority,
                  params.encodings.map(({ active }: { active: boolean }) => ({ active }))
                );
                sender.setParameters(params);
              });
            };

            if (pc.signalingState === 'stable') {
              onSignalingStateStable();
            } else {
              pc.onsignalingstatechange = () => pc.signalingState === 'stable' && onSignalingStateStable();
            }
          }
        },
        error => {
          onError(error);
          setIsConnecting(false);
        }
      );
    },
    [onError, localTracks]
  );

  return { room, isConnecting, connect };
}
