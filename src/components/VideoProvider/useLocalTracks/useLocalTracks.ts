import { useCallback, useEffect, useState } from 'react';
import Video, { LocalVideoTrack, LocalAudioTrack, CreateLocalTrackOptions } from 'twilio-video';

export default function useLocalTracks() {
  const [audioTrack, setAudioTrack] = useState<LocalAudioTrack>();
  const [videoTrack, setVideoTrack] = useState<LocalVideoTrack>();
  const [isAcquiringLocalTracks, setIsAcquiringLocalTracks] = useState(false);

  const getLocalAudioTrack = useCallback((deviceId?: string) => {
    const options: CreateLocalTrackOptions = {};

    if (deviceId) {
      options.deviceId = { exact: deviceId };
    }

    return Video.createLocalAudioTrack(options).then(newTrack => {
      setAudioTrack(newTrack);
      return newTrack;
    });
  }, []);

  const getLocalVideoTrack = useCallback((newOptions?: CreateLocalTrackOptions) => {
    // In the DeviceSelector and FlipCameraButton components, a new video track is created,
    // then the old track is unpublished and the new track is published. Unpublishing the old
    // track and publishing the new track at the same time sometimes causes a conflict when the
    // track name is 'camera', so here we append a timestamp to the track name to avoid the
    // conflict.
    const options: CreateLocalTrackOptions = {
      frameRate: 24,
      height: 720,
      width: 1280,
      name: `camera-${Date.now()}`,
      ...newOptions,
    };

    return Video.createLocalVideoTrack(options).then(newTrack => {
      setVideoTrack(newTrack);
      return newTrack;
    });
  }, []);

  useEffect(() => {
    setIsAcquiringLocalTracks(true);
    Video.createLocalTracks({
      video: {
        frameRate: 24,
        height: 720,
        width: 1280,
        name: `camera-${Date.now()}`,
      },
      audio: true,
    })
      .then(tracks => {
        const videoTrack = tracks.find(track => track.kind === 'video');
        const audioTrack = tracks.find(track => track.kind === 'audio');
        if (videoTrack) {
          setVideoTrack(videoTrack as LocalVideoTrack);
        }
        if (audioTrack) {
          setAudioTrack(audioTrack as LocalAudioTrack);
        }
      })
      .finally(() => setIsAcquiringLocalTracks(false));
  }, []);

  useEffect(() => {
    const handleStopped = () => setAudioTrack(undefined);
    if (audioTrack) {
      audioTrack.on('stopped', handleStopped);
      return () => {
        audioTrack.off('stopped', handleStopped);
      };
    }
  }, [audioTrack]);

  useEffect(() => {
    const handleStopped = () => setVideoTrack(undefined);
    if (videoTrack) {
      videoTrack.on('stopped', handleStopped);
      return () => {
        videoTrack.off('stopped', handleStopped);
      };
    }
  }, [videoTrack]);

  const localTracks = [audioTrack, videoTrack].filter(track => track !== undefined) as (
    | LocalAudioTrack
    | LocalVideoTrack
  )[];

  return { localTracks, getLocalVideoTrack, getLocalAudioTrack, isAcquiringLocalTracks };
}
