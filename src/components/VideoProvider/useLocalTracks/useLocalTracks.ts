import { useCallback, useEffect, useState } from 'react';
import Video, { LocalTrack, LocalVideoTrack, LocalAudioTrack } from 'twilio-video';

export function useLocalAudioTrack() {
  const [track, setTrack] = useState<LocalAudioTrack>();

  const getLocalAudioTrack = useCallback(
    () =>
      Video.createLocalAudioTrack({ name: 'microphone' }).then(newTrack => {
        setTrack(newTrack);
        return newTrack;
      }),
    []
  );

  useEffect(() => {
    getLocalAudioTrack();
  }, [getLocalAudioTrack]);

  useEffect(() => {
    const handleStopped = () => setTrack(undefined);
    if (track) {
      track.on('stopped', handleStopped);
      return () => {
        track.off('stopped', handleStopped);
      };
    }
  }, [track]);

  return [track, getLocalAudioTrack] as const;
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
  const [audioTrack, getLocalAudioTrack] = useLocalAudioTrack();
  const [videoTrack, getLocalVideoTrack] = useLocalVideoTrack();

  const localTracks = [audioTrack, videoTrack].filter(track => track !== undefined) as LocalTrack[];

  return { localTracks, getLocalAudioTrack, getLocalVideoTrack };
}
