import { useState, useEffect } from 'react';
import { LocalVideoTrack, RemoteVideoTrack } from 'twilio-video';

type TrackType = RemoteVideoTrack | LocalVideoTrack | undefined | null;

export default function useIsTrackSwitchedOff(track: TrackType) {
  const [isSwitchedOff, setIsSwitchedOff] = useState(track && track.isSwitchedOff);

  useEffect(() => {
    setIsSwitchedOff(track && track.isSwitchedOff);

    if (track) {
      const handleSwitchedOff = () => setIsSwitchedOff(true);
      const handleSwitchedOn = () => setIsSwitchedOff(false);
      track.on('switchedOff', handleSwitchedOff);
      track.on('switchedOn', handleSwitchedOn);
      return () => {
        track.off('switchedOff', handleSwitchedOff);
        track.off('switchedOn', handleSwitchedOn);
      };
    }
  }, [track]);

  return !!isSwitchedOff;
}
