import React from 'react';
import { LocalAudioTrack } from 'twilio-video';
import useVideoContext from '../../../src/hooks/useVideoContext/useVideoContext';
import AudioLevelIndicator from '../AudioLevelIndicator/AudioLevelIndicator';

interface LocalAudioLevelIndicatorProps {
  size?: number,
  background?: string,
}

export default function LocalAudioLevelIndicator(props: LocalAudioLevelIndicatorProps) {
  const { size = 25, background } = props;
  const { localTracks } = useVideoContext();
  const audioTrack = localTracks.find(track => track.kind === 'audio') as LocalAudioTrack;

  return <AudioLevelIndicator size={size} audioTrack={audioTrack} background={background} />;
}
