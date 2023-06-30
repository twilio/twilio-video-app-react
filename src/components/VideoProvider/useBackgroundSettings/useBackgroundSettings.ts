import { LocalVideoTrack, Room } from 'twilio-video';
import { useCallback, useEffect } from 'react';
import {
  BACKGROUND_FILTER_VIDEO_CONSTRAINTS,
  DEFAULT_VIDEO_CONSTRAINTS,
  SELECTED_BACKGROUND_SETTINGS_KEY,
} from '../../../constants';
import {
  GaussianBlurBackgroundProcessor,
  ImageFit,
  isSupported,
  VirtualBackgroundProcessor,
} from '@twilio/video-processors';
import Abstract from '../../../images/Abstract.jpg';
import AbstractThumb from '../../../images/thumb/Abstract.jpg';
import BohoHome from '../../../images/BohoHome.jpg';
import BohoHomeThumb from '../../../images/thumb/BohoHome.jpg';
import Bookshelf from '../../../images/Bookshelf.jpg';
import BookshelfThumb from '../../../images/thumb/Bookshelf.jpg';
import CoffeeShop from '../../../images/CoffeeShop.jpg';
import CoffeeShopThumb from '../../../images/thumb/CoffeeShop.jpg';
import Contemporary from '../../../images/Contemporary.jpg';
import ContemporaryThumb from '../../../images/thumb/Contemporary.jpg';
import CozyHome from '../../../images/CozyHome.jpg';
import CozyHomeThumb from '../../../images/thumb/CozyHome.jpg';
import Desert from '../../../images/Desert.jpg';
import DesertThumb from '../../../images/thumb/Desert.jpg';
import Fishing from '../../../images/Fishing.jpg';
import FishingThumb from '../../../images/thumb/Fishing.jpg';
import Flower from '../../../images/Flower.jpg';
import FlowerThumb from '../../../images/thumb/Flower.jpg';
import Kitchen from '../../../images/Kitchen.jpg';
import KitchenThumb from '../../../images/thumb/Kitchen.jpg';
import ModernHome from '../../../images/ModernHome.jpg';
import ModernHomeThumb from '../../../images/thumb/ModernHome.jpg';
import Nature from '../../../images/Nature.jpg';
import NatureThumb from '../../../images/thumb/Nature.jpg';
import Ocean from '../../../images/Ocean.jpg';
import OceanThumb from '../../../images/thumb/Ocean.jpg';
import Patio from '../../../images/Patio.jpg';
import PatioThumb from '../../../images/thumb/Patio.jpg';
import Plant from '../../../images/Plant.jpg';
import PlantThumb from '../../../images/thumb/Plant.jpg';
import SanFrancisco from '../../../images/SanFrancisco.jpg';
import SanFranciscoThumb from '../../../images/thumb/SanFrancisco.jpg';
import { Thumbnail } from '../../BackgroundSelectionDialog/BackgroundThumbnail/BackgroundThumbnail';
import { useLocalStorageState } from '../../../hooks/useLocalStorageState/useLocalStorageState';

export interface BackgroundSettings {
  type: Thumbnail;
  index?: number;
}

const imageNames: string[] = [
  'Abstract',
  'Boho Home',
  'Bookshelf',
  'Coffee Shop',
  'Contemporary',
  'Cozy Home',
  'Desert',
  'Fishing',
  'Flower',
  'Kitchen',
  'Modern Home',
  'Nature',
  'Ocean',
  'Patio',
  'Plant',
  'San Francisco',
];

const images = [
  AbstractThumb,
  BohoHomeThumb,
  BookshelfThumb,
  CoffeeShopThumb,
  ContemporaryThumb,
  CozyHomeThumb,
  DesertThumb,
  FishingThumb,
  FlowerThumb,
  KitchenThumb,
  ModernHomeThumb,
  NatureThumb,
  OceanThumb,
  PatioThumb,
  PlantThumb,
  SanFranciscoThumb,
];

const rawImagePaths = [
  Abstract,
  BohoHome,
  Bookshelf,
  CoffeeShop,
  Contemporary,
  CozyHome,
  Desert,
  Fishing,
  Flower,
  Kitchen,
  ModernHome,
  Nature,
  Ocean,
  Patio,
  Plant,
  SanFrancisco,
];

const isDesktopChrome = /Chrome/.test(navigator.userAgent);
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

export const backgroundConfig = {
  imageNames,
  images,
};

const virtualBackgroundAssets = '/virtualbackground';
let blurProcessor: GaussianBlurBackgroundProcessor;
let virtualBackgroundProcessor: VirtualBackgroundProcessor;

export default function useBackgroundSettings(videoTrack: LocalVideoTrack | undefined, room?: Room | null) {
  const [backgroundSettings, setBackgroundSettings] = useLocalStorageState<BackgroundSettings>(
    SELECTED_BACKGROUND_SETTINGS_KEY,
    { type: 'none', index: 0 }
  );

  const setCaptureConstraints = useCallback(async () => {
    const { mediaStreamTrack, processor } = videoTrack ?? {};
    const { type } = backgroundSettings;
    if (type === 'none' && processor) {
      return mediaStreamTrack?.applyConstraints(DEFAULT_VIDEO_CONSTRAINTS as MediaTrackConstraints);
    } else if (type !== 'none' && !processor) {
      return mediaStreamTrack?.applyConstraints(BACKGROUND_FILTER_VIDEO_CONSTRAINTS as MediaTrackConstraints);
    }
  }, [backgroundSettings, videoTrack]);

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
      videoTrack.addProcessor(processor, {
        inputFrameBufferType: 'video',
        outputFrameBufferContextType: 'webgl2',
      });
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
          // Disable debounce only on desktop Chrome as other browsers either
          // do not support WebAssembly SIMD or they degrade performance.
          debounce: !isDesktopChrome,
        });
        await blurProcessor.loadModel();
      }
      if (!virtualBackgroundProcessor) {
        virtualBackgroundProcessor = new VirtualBackgroundProcessor({
          assetsPath: virtualBackgroundAssets,
          backgroundImage: await getImage(0),
          // Disable debounce only on desktop Chrome as other browsers either
          // do not support WebAssembly SIMD or they degrade performance.
          debounce: !isDesktopChrome,
          fitType: ImageFit.Cover,
        });
        await virtualBackgroundProcessor.loadModel();
      }
      if (!room?.localParticipant) {
        return;
      }

      // Switch to 640x480 dimensions on desktop Chrome or browsers that
      // do not support WebAssembly SIMD to achieve optimum performance.
      const processor = blurProcessor || virtualBackgroundProcessor;
      // @ts-ignore
      if (!processor._isSimdEnabled || isDesktopChrome) {
        await setCaptureConstraints();
      }

      if (backgroundSettings.type === 'blur') {
        addProcessor(blurProcessor);
      } else if (backgroundSettings.type === 'image' && typeof backgroundSettings.index === 'number') {
        virtualBackgroundProcessor.backgroundImage = await getImage(backgroundSettings.index);
        addProcessor(virtualBackgroundProcessor);
      } else {
        removeProcessor();
      }
    };
    handleProcessorChange();
  }, [backgroundSettings, videoTrack, room, addProcessor, removeProcessor, setCaptureConstraints]);

  return [backgroundSettings, setBackgroundSettings] as const;
}
