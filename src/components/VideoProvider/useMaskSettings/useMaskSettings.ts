import { LocalVideoTrack, Room } from 'twilio-video';
import { useEffect, useCallback } from 'react';
import { SELECTED_MASK_SETTINGS_KEY } from '../../../constants';
import {
  GaussianBlurBackgroundProcessor,
  VirtualBackgroundProcessor,
  ImageFit,
  isSupported,
} from '@twilio/video-processors';
// TODO: replace these mock photos with actual face masks
import Abstract from '../../../images/Abstract.jpg';
import AbstractThumb from '../../../images/thumb/Abstract.jpg';
import BohoHome from '../../../images/BohoHome.jpg';
import BohoHomeThumb from '../../../images/thumb/BohoHome.jpg';
import { Thumbnail } from '../../BackgroundSelectionDialog/BackgroundThumbnail/BackgroundThumbnail'; // TODO: import from mask thumbnail component
import { useLocalStorageState } from '../../../hooks/useLocalStorageState/useLocalStorageState';

export interface MaskSettings {
  type: Thumbnail;
  index?: number;
}

const imageNames: string[] = ['Abstract', 'Boho Home'];

const images = [AbstractThumb, BohoHomeThumb];

const rawImagePaths = [Abstract, BohoHome];

let imageElements = new Map();

const getImage = (index: number): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    if (imageElements.has(index)) {
      return resolve(imageElements.get(index));
    }
    const img = new Image();
    img.onload = () => {
      imageElements.set(index, img);
      resolve(img);
    };
    img.onerror = reject;
    img.src = rawImagePaths[index];
  });
};

export const maskConfig = {
  imageNames,
  images,
};

const virtualBackgroundAssets = '/faceMask';
let blurProcessor: GaussianBlurBackgroundProcessor;
let virtualBackgroundProcessor: VirtualBackgroundProcessor;

export default function useMaskSettings(videoTrack: LocalVideoTrack | undefined, room?: Room | null) {
  const [maskSettings, setMaskSettings] = useLocalStorageState<MaskSettings>(SELECTED_MASK_SETTINGS_KEY, {
    type: 'none',
    index: 0,
  });

  const removeProcessor = useCallback(() => {
    if (videoTrack && videoTrack.processor) {
      videoTrack.removeProcessor(videoTrack.processor);
    }
  }, [videoTrack]);

  const addProcessor = useCallback(
    (processor: GaussianBlurBackgroundProcessor | VirtualBackgroundProcessor) => {
      if (!videoTrack || videoTrack.processor === processor) {
        return;
      }
      removeProcessor();
      videoTrack.addProcessor(processor);
    },
    [videoTrack, removeProcessor]
  );

  useEffect(() => {
    if (!isSupported) {
      return;
    }
    // make sure localParticipant has joined room before applying video processors
    // this ensures that the video processors are not applied on the LocalVideoPreview
    const handleProcessorChange = async () => {
      if (!blurProcessor) {
        blurProcessor = new GaussianBlurBackgroundProcessor({
          assetsPath: virtualBackgroundAssets,
        });
        await blurProcessor.loadModel();
      }
      if (!virtualBackgroundProcessor) {
        virtualBackgroundProcessor = new VirtualBackgroundProcessor({
          assetsPath: virtualBackgroundAssets,
          backgroundImage: await getImage(0),
          fitType: ImageFit.Cover,
        });
        await virtualBackgroundProcessor.loadModel();
      }
      if (!room?.localParticipant) {
        return;
      }

      if (maskSettings.type === 'blur') {
        addProcessor(blurProcessor);
      } else if (maskSettings.type === 'image' && typeof maskSettings.index === 'number') {
        virtualBackgroundProcessor.backgroundImage = await getImage(maskSettings.index);
        addProcessor(virtualBackgroundProcessor);
      } else {
        removeProcessor();
      }
    };
    handleProcessorChange();
  }, [maskSettings, videoTrack, room, addProcessor, removeProcessor]);

  return [maskSettings, setMaskSettings] as const;
}
