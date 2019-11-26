import { useCallback, useEffect, useState } from 'react';
import Video, { LocalTrack, LocalVideoTrack } from 'twilio-video';

export function useLocalAudioTrack() {
  const [track, setTrack] = useState<LocalTrack>();

  useEffect(() => {
    Video.createLocalAudioTrack({ name: 'microphone' }).then(newTrack => setTrack(newTrack));
  }, [setTrack]);

  return track;
}

export function useLocalVideoTrack() {
  const [track, setTrack] = useState<LocalVideoTrack>();

  const getLocalVideoTrack = useCallback(
    () =>
      Video.createLocalVideoTrack({
        name: 'camera',
        width: { ideal: 1280 },
        height: { ideal: 720 },
      }).then(newTrack => {
        setTrack(newTrack);
        return newTrack;
      }),
    []
  );

  useEffect(() => {
    getLocalVideoTrack();
  }, [getLocalVideoTrack]);

  useEffect(() => {
    const handleStopped = () => setTrack(undefined);
    if (track) {
      track.on('stopped', handleStopped);
      return () => {
        track.off('stopped', handleStopped);
      };
    }
  }, [track]);

  return [track, getLocalVideoTrack] as const;
}

export default function useLocalTracks() {
  const audioTrack = useLocalAudioTrack();
  const [videoTrack, getLocalVideoTrack] = useLocalVideoTrack();

  const tracks = [audioTrack, videoTrack].filter(track => track !== undefined) as LocalTrack[];

  return [tracks, getLocalVideoTrack] as const;
}
