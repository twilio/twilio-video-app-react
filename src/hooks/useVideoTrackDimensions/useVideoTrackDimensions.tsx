import { useState, useEffect } from 'react';
import { LocalVideoTrack, RemoteVideoTrack } from 'twilio-video';

type TrackType = LocalVideoTrack | RemoteVideoTrack;

export default function useVideoTrackDimensions(track?: TrackType) {
  const [dimensions, setDimensions] = useState(track?.dimensions);

  useEffect(() => {
    setDimensions(track?.dimensions);

    if (track) {
      const handleDimensionsChanged = (newTrack: TrackType) =>
        setDimensions({
          width: newTrack.dimensions.width,
          height: newTrack.dimensions.height,
        });
      track.on('dimensionsChanged', handleDimensionsChanged);
      return () => {
        track.off('dimensionsChanged', handleDimensionsChanged);
      };
    }
  }, [track]);

  return dimensions;
}
