import { useState, useEffect } from 'react';
import { LocalAudioTrack, LocalVideoTrack, RemoteAudioTrack, RemoteVideoTrack } from 'twilio-video';

type TrackType = LocalAudioTrack | LocalVideoTrack | RemoteAudioTrack | RemoteVideoTrack | undefined | null;

export default function useTrackSwitchOffReason(track: TrackType) {
  //@ts-ignore
  const [switchOffReason, setSwitchOffReason] = useState(track?.switchOffReason);

  useEffect(() => {
    if (track) {
      // @ts-ignore
      setSwitchOffReason(track.switchOffReason);
      const handleEvent = (_track: TrackType) => {
        // @ts-ignore
        setSwitchOffReason(_track.switchOffReason);
      };
      track.on('switchedOff', handleEvent);
      track.on('switchedOn', handleEvent);
      return () => {
        track.off('switchedOff', handleEvent);
        track.off('switchedOn', handleEvent);
      };
    }
  }, [track]);

  return switchOffReason;
}
