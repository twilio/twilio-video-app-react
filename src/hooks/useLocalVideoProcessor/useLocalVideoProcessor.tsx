import { useCallback } from 'react';
import { LocalVideoTrack, VideoProcessor } from 'twilio-video';
import useVideoContext from '../useVideoContext/useVideoContext';
import { GrayScaleProcessor, BlurProcessor } from './processor';

const grayscale = new GrayScaleProcessor();
const blur = new BlurProcessor();

export default function useLocalVideoProcessor() {
  const { localTracks } = useVideoContext();
  const videoTrack = localTracks.find(track => track.name.includes('camera')) as LocalVideoTrack;

  const setProcessor = (track: LocalVideoTrack, processor?: VideoProcessor) => {
    if (track) {
      if (track.processor) {
        track.removeProcessor(track.processor);
      }
      if (processor) {
        track.addProcessor(processor);
      }
    }
  };

  const setGrayScaleProcessor = useCallback(() => {
    setProcessor(videoTrack, grayscale);
  }, [videoTrack]);

  const setBlurProcessor = useCallback(() => {
    setProcessor(videoTrack, blur);
  }, [videoTrack]);

  const setNoFilter = useCallback(() => {
    setProcessor(videoTrack);
  }, [videoTrack]);

  return [setGrayScaleProcessor, setBlurProcessor, setNoFilter] as const;
}
