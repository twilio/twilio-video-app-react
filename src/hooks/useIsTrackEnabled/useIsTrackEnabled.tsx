import { useState, useEffect } from 'react';
import { LocalAudioTrack, LocalVideoTrack, RemoteAudioTrack, RemoteVideoTrack } from 'twilio-video';

type TrackType = LocalAudioTrack | LocalVideoTrack | RemoteAudioTrack | RemoteVideoTrack | undefined;

export default function useIsTrackEnabled(track: TrackType) {
  const [isEnabled, setIsEnabled] = useState(track ? track.isEnabled : false);

  useEffect(() => {
    // @ts-ignore
    setIsEnabled(track.mediaStreamTrack === null || track.switchOffReason !== 'DisabledByPublisher');

    if (track) {
      const handleSwitchOff = (_track: TrackType) => {
        // @ts-ignore
        if (_track.switchOffReason === 'DisabledByPublisher') {
          setIsEnabled(false);
        }
      };
      const handleSwitchOn = () => setIsEnabled(true);
      track.on('switchedOff', handleSwitchOff);
      track.on('switchedOn', handleSwitchOn);
      return () => {
        track.off('switchedOff', handleSwitchOff);
        track.off('switchedOn', handleSwitchOn);
      };
    }
  }, [track]);

  return isEnabled;
}
