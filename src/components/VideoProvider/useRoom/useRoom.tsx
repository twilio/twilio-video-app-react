import { Callback } from '../../../types';
import EventEmitter from 'events';
import { isMobile } from '../../../utils';
import Video, {
  ConnectOptions,
  LocalDataTrack,
  LocalTrack,
  LocalVideoTrackPublication,
  RemoteDataTrackPublication,
  RemoteParticipant,
  RemoteVideoTrackPublication,
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

          // This app can add up to 13 'participantDisconnected' listeners to the room object, which can trigger
          // a warning from the EventEmitter object. Here we increase the max listeners to suppress the warning.
          newRoom.setMaxListeners(15);

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
          let videoSubscriptionResolutions: any = {};
          updateVideoSubscription();
          /********************************************************************************************/

          newRoom.localParticipant.videoTracks.forEach(publication =>
            // All video tracks are published with 'low' priority because the video track
            // that is displayed in the 'MainParticipant' component will have it's priority
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
              const origAttach = track.attach;
              const origDetach = track.detach;

              track.attach = function attach() {
                const ret = origAttach.apply(this, arguments);
                setTimeout(sendVideoSubscriptionUpdate, 100);
                return ret;
              };

              track.detach = function detach() {
                const ret = origDetach.apply(this, arguments);
                setTimeout(sendVideoSubscriptionUpdate, 100);
                return ret;
              };
            }
          });

          newRoom.on('trackUnsubscribed', (track, publication, participant) => {
            if (track.kind === 'data' && track.name === 'video_subscription_signaling') {
              delete videoSubscriptionResolutions[participant.identity];
              videoSubscriptionSignalings.delete(participant);
              updateVideoSubscription();
            } else if (track.kind === 'video') {
              sendVideoSubscriptionUpdate();
            }
          });

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
                const { resolutions } = json[newRoom.localParticipant.identity];
                updateVideoSubscription(participant.identity, resolutions);
              }
            });
          }
          /***************************************************************************************************/

          /******************************** Send a video subscription update. *****************************/
          function sendVideoSubscriptionUpdate() {
            let update: any = {};
            videoSubscriptionSignalings.forEach((signaling, participant) => {
              update[participant.identity] = {};
              participant.videoTracks.forEach((publication: RemoteVideoTrackPublication) => {
                const { track }: any = publication;
                if (track && !track.isSwitchedOff) {
                  const videoEls = track
                    ._getAllAttachedElements()
                    .sort(
                      (el1: any, el2: any) =>
                        el2.clientWidth * el2.clientHeight - el1.clientWidth * el1.clientHeight - 1
                    );

                  update[participant.identity].resolutions = update[participant.identity].resolutions || {};
                  update[participant.identity].resolutions[publication.trackSid] = videoEls[0]
                    ? { width: videoEls[0].clientWidth, height: videoEls[0].clientHeight }
                    : { width: 0, height: 0 };
                } else {
                  update[participant.identity].resolutions = update[participant.identity].resolutions || {};
                  update[participant.identity].resolutions[publication.trackSid] = { width: 0, height: 0 };
                }
              });
            });
            console.log('Outgoing:', update);
            videoSubscriptionSignaling.send(JSON.stringify(update));
          }
          /************************************************************************************************/

          /********************* Update the encodings based on subscription info. ******************************/
          function updateVideoSubscription(participantIdentity?: string, resolutions: any = {}) {
            if (participantIdentity) {
              videoSubscriptionResolutions[participantIdentity] = { ...resolutions };
            }
            console.log('Subscription resolutions:', JSON.stringify(videoSubscriptionResolutions, null, 2));

            const maxResolutions: any = {};

            newRoom.localParticipant.videoTracks.forEach((publication: LocalVideoTrackPublication) => {
              const resolutions: any = Object.values(videoSubscriptionResolutions).reduce(
                (curResolutions: any, resolutions: any) => {
                  if (resolutions[publication.trackSid]) {
                    curResolutions.push(resolutions[publication.trackSid]);
                  }
                  return curResolutions;
                },
                []
              );
              const maxResolution = resolutions.reduce(
                (currentMaxResolution: any, { width, height }: any) => {
                  return currentMaxResolution.width * currentMaxResolution.height > width * height
                    ? currentMaxResolution
                    : { width, height };
                },
                { width: 0, height: 0 }
              );
              maxResolutions[publication.trackSid] = maxResolution;
            });

            const onSignalingStateStable = () => {
              // No need to listen to signaling state changes anymore.
              pc.onsignalingstatechange = null;

              // If Room is disconnected, do nothing.
              if (newRoom.state === 'disconnected') {
                return;
              }

              newRoom.localParticipant.videoTracks.forEach((publication: any) => {
                const { track, trackSid } = publication;
                const clonedTrackSender: any = Array.from(track._trackSender._clones)[0];
                const rtpSender: any = Array.from(clonedTrackSender._senders)[0];
                const params = rtpSender.getParameters();
                const { height } = rtpSender.track.getSettings();
                const maxResolution = maxResolutions[trackSid] || { width: 0, height: 0 };
                const scaleDownFactor = Math.max(1.0, height / maxResolution.height);
                const layerMaxIdx = params.encodings.length - 1;

                const layerIdx =
                  scaleDownFactor >= Infinity
                    ? -1
                    : scaleDownFactor < 0
                    ? layerMaxIdx
                    : Math.round(Math.max(0, Math.min(layerMaxIdx, layerMaxIdx - Math.log2(scaleDownFactor))));

                params.encodings.forEach((encoding: any, i: number) => {
                  encoding.active = i <= layerIdx;
                });

                console.log(
                  'Encodings:',
                  trackSid,
                  scaleDownFactor,
                  layerIdx,
                  params.encodings.map(({ active }: { active: boolean }) => ({ active }))
                );

                rtpSender.setParameters(params);
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
    [localTracks, onError]
  );

  return { room, isConnecting, connect };
}
