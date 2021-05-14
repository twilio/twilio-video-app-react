import { Callback } from '../../../types';
import { isMobile } from '../../../utils';
import Video, { ConnectOptions, LocalTrack, LocalVideoTrackPublication, Room } from 'twilio-video';
import { useCallback, useEffect, useRef, useState } from 'react';

// @ts-ignore
window.TwilioVideo = Video;

export default function useRoom(localTracks: LocalTrack[], onError: Callback, options?: ConnectOptions) {
  const [room, setRoom] = useState<Room | null>(null);
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
            window.removeEventListener('beforeunload', disconnect);

            if (isMobile) {
              window.removeEventListener('pagehide', disconnect);
            }
          });

          // @ts-ignore
          window.twilioRoom = newRoom;

          const whenPCSignalingStateStable = () =>
            new Promise(resolve => {
              const {
                _signaling: {
                  _peerConnectionManager: { _peerConnections: pcv2s },
                },
              } = newRoom as any;
              const [{ _peerConnection: pc }] = [...pcv2s.values()];
              if (pc.signalingState === 'stable') {
                resolve();
                return;
              }
              pc.onsignalingstatechange = () => {
                if (pc.signalingState === 'stable') {
                  pc.onsignalingstatechange = null;
                  resolve();
                }
              };
            });

          newRoom.localParticipant.videoTracks.forEach(publication => {
            publication.on('subscriberPreferences', (preferences, parameters, setParameters) =>
              onSubscriberPreferences(publication, preferences, parameters, setParameters)
            );

            // NOTE(mmalavalli): Set a dummy hint to disable all layers initially.
            whenPCSignalingStateStable().then(() =>
              (publication as any).setSubscriberHint({
                hint: { enabled: false },
                subscriber: newRoom.localParticipant.sid,
                track: publication.trackSid,
              })
            );

            // All video tracks are published with 'low' priority because the video track
            // that is displayed in the 'MainParticipant' component will have it's priority
            // set to 'high' via track.setPriority()
            publication.setPriority('low');
          });

          newRoom.localParticipant.on('trackPublished', publication => {
            if (publication.track.kind === 'video') {
              publication.on('subscriberPreferences', (preferences, parameters, setParameters) =>
                onSubscriberPreferences(
                  publication as LocalVideoTrackPublication,
                  preferences,
                  parameters,
                  setParameters
                )
              );

              // NOTE(mmalavalli): Set a dummy hint to disable all layers initially.
              whenPCSignalingStateStable().then(() =>
                (publication as any).setSubscriberHint({
                  hint: { enabled: false },
                  subscriber: newRoom.localParticipant.sid,
                  track: publication.trackSid,
                })
              );
            }
          });

          setIsConnecting(false);

          // Add a listener to disconnect from the room when a user closes their browser
          window.addEventListener('beforeunload', disconnect);

          if (isMobile) {
            // Add a listener to disconnect from the room when a mobile user closes their browser
            window.addEventListener('pagehide', disconnect);
          }
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

function createPublisherHints(publishedTrackSid: string, subscriberPreferences: any, layerDims: any[]): any {
  const active = [...subscriberPreferences.values()].reduce((active_, prefs) => active_ || prefs.hint.enabled, false);

  if (active === false) {
    return {
      hints: [
        {
          encodings: layerDims.map(({ layerIndex }) => ({
            active: false,
            layer_index: layerIndex,
          })),
          track: publishedTrackSid,
        },
      ],
      type: 'publisher_hint',
    };
  }

  const enabledDims = [...subscriberPreferences.values()]
    .filter(prefs => prefs.hint.enabled)
    .map(prefs => prefs.hint.renderDimensions || { height: 720, width: 1280 });

  const [maxDims] = enabledDims.sort((dims1, dims2) => taxiCabDistance(dims2) - taxiCabDistance(dims1) - 1);

  const [maxLayerDim] = layerDims.sort(
    (dims1, dims2) => taxiCabDistance(dims1, maxDims) - taxiCabDistance(dims2, maxDims) - 1
  );

  return {
    hints: [
      {
        encodings: layerDims.map(({ layerIndex }) => ({
          active: layerIndex <= maxLayerDim.layerIndex,
          layer_index: layerIndex,
        })),
        track: publishedTrackSid,
      },
    ],
    type: 'publisher_hint',
  };
}

const subscriberPreferences = new Map();

function onSubscriberPreferences(
  publication: LocalVideoTrackPublication,
  preferences: any,
  parameters: any,
  setParameters: any
): void {
  console.log(`Subscriber hints [${publication.trackName}]:`, JSON.stringify(preferences, null, 2));

  const trackPreferences = subscriberPreferences.get(publication.trackSid) || new Map();
  const subscriberTrackPreferences = {
    ...(trackPreferences.get(preferences.subscriber) || {}),
    ...preferences,
  };

  trackPreferences.set(preferences.subscriber, subscriberTrackPreferences);
  subscriberPreferences.set(publication.trackSid, trackPreferences);

  const { frameRate, height, width } = publication.track.mediaStreamTrack.getSettings();
  const nEncodings = parameters.encodings.length;
  const isScreenShare = publication.trackName === 'screen';

  const layerDims = parameters.encodings.map((encoding: any, i: number) => {
    const {
      maxFramerate = isScreenShare ? frameRate! >> (nEncodings - i - 1) : frameRate! >> Number(!i),
      scaleResolutionDownBy = isScreenShare ? 1 : 1 << (nEncodings - i - 1),
    } = encoding;

    encoding.maxFramerate = maxFramerate;
    encoding.scaleResolutionDownBy = scaleResolutionDownBy;

    return {
      height: Math.round(height! / scaleResolutionDownBy),
      layerIndex: i,
      width: Math.round(width! / scaleResolutionDownBy),
    };
  });

  const publisherHints = createPublisherHints(publication.trackSid, trackPreferences, layerDims);

  console.log(`Publisher hints: hints [${publication.trackName}]:`, JSON.stringify(publisherHints, null, 2));

  publisherHints.hints[0].encodings.forEach(
    ({ active, layer_index }: any) => (parameters.encodings[layer_index].active = active)
  );

  setParameters(parameters);
}

function taxiCabDistance(dims1: any, dims2: any = { height: 0, width: 0 }): number {
  return Math.abs(dims1.width - dims2.width + dims1.height - dims2.height);
}
