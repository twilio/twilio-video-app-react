import { useState, useEffect } from 'react';
import { LocalAudioTrack, LocalVideoTrack, RemoteAudioTrack, RemoteVideoTrack } from 'twilio-video';

type TrackType = LocalAudioTrack | LocalVideoTrack | RemoteAudioTrack | RemoteVideoTrack | undefined;

export default function useIsTrackEnabled(track: TrackType) {
  const [isEnabled, setIsEnabled] = useState(track ? track.isEnabled : false);

  useEffect(() => {
    //@ts-ignore

    if (track) {
      if (track instanceof LocalAudioTrack || track instanceof LocalVideoTrack) {
        setIsEnabled(track.isEnabled);
        const setEnabled = () => setIsEnabled(true);
        const setDisabled = () => setIsEnabled(false);
        track.on('enabled', setEnabled);
        track.on('disabled', setDisabled);
        return () => {
          track.off('enabled', setEnabled);
          track.off('disabled', setDisabled);
        };
      } else {
        setIsEnabled(track?.switchOffReason !== 'disabled-by-publisher');
        const handleSwitchOff = (_track: TrackType) => {
          // @ts-ignore
          if (_track.switchOffReason === 'disabled-by-publisher') {
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
    }
  }, [track]);

  return isEnabled;
}
