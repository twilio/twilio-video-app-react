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

      /******* Add a LocalDataTrack for sharing VideoTrack subscription information. ****************/
      const videoSubscriptionSignaling = new LocalDataTrack({ name: 'video_subscription_signaling' });
      localTracks.push(videoSubscriptionSignaling);
      /**********************************************************************************************/

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

          /*** Initially, don't send any video bytes until at least one Participant joins the Room. ***/
          let videoSubscriptionPriorities: any = {};
          updateVideoSubscription();
          /********************************************************************************************/

          newRoom.localParticipant.videoTracks.forEach((publication: any) =>
            // Tracks can be supplied as arguments to the Video.connect() function and they will automatically be published.
            // However, tracks must be published manually in order to set the priority on them.
            // All video tracks are published with 'low' priority. This works because the video
            // track that is displayed in the 'MainParticipant' component will have it's priority
            // set to 'high' via track.setPriority()
            publication.setPriority('low')
          );

          /********* Build a list of subscription signaling channels published by the Room's RemoteParticipants. **********/
          let videoSubscriptionSignalings = new Map();
          [...newRoom.participants.values()].forEach(participant => {
            const videoSubscriptionSignaling = [...participant.dataTracks.values()].find(publication => {
              return publication.track && publication.trackName === 'video_subscription_signaling';
            });
            if (videoSubscriptionSignaling) {
              videoSubscriptionSignalings.set(participant, videoSubscriptionSignaling);
            }
          });

          videoSubscriptionSignalings.forEach((publication, participant) =>
            videoSubscriptionSignalingSubscribed(publication as RemoteDataTrackPublication, participant)
          );
          /***************************************************************************************************************/

          /*** Send video subscription updates to other Participants in the Room. ***/
          sendVideoSubscriptionUpdate();
          /**************************************************************************/

          /********** Manage future subscription signaling channels and RemoteVideoTrack changes. ***********/
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
          /**************************************************************************************************/

          setIsConnecting(false);

          // Add a listener to disconnect from the room when a user closes their browser
          window.addEventListener('beforeunload', disconnect);

          if (isMobile) {
            // Add a listener to disconnect from the room when a mobile user closes their browser
            window.addEventListener('pagehide', disconnect);
          }

          /******** Update encoding layers whenever a new subscription signaling message is received. ********/
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
                const { priority, resolution } = json[newRoom.localParticipant.identity];
                updateVideoSubscription(participant.identity, priority, resolution);
              }
            });
          }
          /***************************************************************************************************/

          /******************************** Send a video subscription update. *****************************/
          function sendVideoSubscriptionUpdate() {
            let update: any = {};
            videoSubscriptionSignalings.forEach((signaling, participant) => {
              const [{ publishPriority, track }] = [...participant.videoTracks.values()];
              let priority;
              if (!track || track.isSwitchedOff) {
                priority = 'off';
                update = {
                  [participant.identity]: {
                    resolution: { width: 0, height: 0 },
                  },
                  ...update,
                };
              } else if (track.priority) {
                priority = track.priority;
              } else if (participant === newRoom.dominantSpeaker) {
                priority = optionsRef.current!.bandwidthProfile!.video!.dominantSpeakerPriority || 'standard';
              } else {
                priority = publishPriority;
              }
              update[participant.identity] = {
                ...update[participant.identity],
                priority,
              };

              if (track && !track.isSwitchedOff) {
                const videoEls = track
                  ._getAllAttachedElements()
                  .sort(
                    (el1: any, el2: any) => el2.clientWidth * el2.clientHeight - el1.clientWidth * el1.clientHeight - 1
                  );
                console.log(videoEls.map((el: any) => `${el.clientWidth}x${el.clientWidth}`));
                update[participant.identity].resolution = videoEls[0]
                  ? {
                      width: videoEls[0].clientWidth,
                      height: videoEls[0].clientHeight,
                    }
                  : { width: 0, height: 0 };
              }
            });
            console.log('Outgoing:', update);
            videoSubscriptionSignaling.send(JSON.stringify(update));
          }
          /************************************************************************************************/

          /********************* Update the encodings based on subscription info. ******************************/
          function updateVideoSubscription(
            participantIdentity?: string,
            priority?: string,
            resolution: any = { width: 0, height: 0 }
          ) {
            if (participantIdentity) {
              videoSubscriptionPriorities[participantIdentity] = { priority, resolution };
            }

            console.log('Priorities and Resolutions:', Object.values(videoSubscriptionPriorities));

            const { maxPriority, maxResolution }: any = Object.values(videoSubscriptionPriorities).reduce(
              (maxPriorityAndResolution: any, { priority, resolution }: any) => {
                const rank = ['off', 'low', 'standard', 'high'];
                const maxPriority =
                  rank.indexOf(maxPriorityAndResolution.maxPriority as string) < rank.indexOf(priority as string)
                    ? (priority as string)
                    : (maxPriorityAndResolution.maxPriority as string);
                const maxResolution =
                  maxPriorityAndResolution.maxResolution.width * maxPriorityAndResolution.maxResolution.height >
                  resolution.width * resolution.height
                    ? maxPriorityAndResolution.maxResolution
                    : resolution;
                return { maxPriority, maxResolution };
              },
              { maxPriority: 'off', maxResolution: { width: 0, height: 0 } }
            );

            const onSignalingStateStable = () => {
              const videoSenders = pc
                .getSenders()
                .filter(({ track }: { track: any }) => track && track.kind === 'video');

              videoSenders.forEach((sender: any) => {
                const params = sender.getParameters();
                const { height } = sender.track.getSettings();
                console.log(`Scale down: ${height}/${maxResolution.height} = ${height / maxResolution.height}`);
                const scaleDownFactor = Math.max(1.0, height / maxResolution.height);

                if (maxPriority === 'off' && window.location.search.includes('applySimLayerSuspension=true')) {
                  params.encodings.forEach((encoding: any) => (encoding.active = false));
                } else {
                  const layerIdx = window.location.search.includes('applySimLayerSuspension=true')
                    ? ['low', 'standard', 'high'].indexOf(maxPriority)
                    : params.encodings.length - 1;
                  params.encodings.forEach((encoding: any, i: number) => {
                    encoding.active = i <= layerIdx || scaleDownFactor !== Infinity;
                    if (
                      encoding.active &&
                      window.location.search.includes('applyContentHints=true') &&
                      scaleDownFactor !== Infinity
                    ) {
                      encoding.scaleResolutionDownBy = (1 << (layerIdx - i)) * scaleDownFactor;
                    } else {
                      delete encoding.scaleResolutionDownBy;
                    }
                  });
                }

                console.log(
                  'Encodings:',
                  maxPriority,
                  params.encodings.map(
                    ({ active, scaleResolutionDownBy }: { active: boolean; scaleResolutionDownBy: number }) => ({
                      active,
                      scaleResolutionDownBy,
                    })
                  )
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
          /*****************************************************************************************************/
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
