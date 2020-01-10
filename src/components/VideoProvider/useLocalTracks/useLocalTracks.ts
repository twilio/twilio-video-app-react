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
        frameRate: 24,
        height: 720,
        width: 1280,
        name: 'camera',
      }).then(newTrack => {
        setTrack(newTrack);
        return newTrack;
      }),
    []
  );

  useEffect(() => {
    // We get a new local video track when the app loads.
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
