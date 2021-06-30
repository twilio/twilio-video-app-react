import { Room } from 'twilio-video';
import { useCallback, useState } from 'react';
import { GaussianBlurBackgroundProcessor } from '@twilio/video-processors';
import AbstractThumb from '../../../images/thumb/Abstract.jpg';
import BohoHomeThumb from '../../../images/thumb/BohoHome.jpg';
import BookshelfThumb from '../../../images/thumb/Bookshelf.jpg';
import CoffeeShopThumb from '../../../images/thumb/CoffeeShop.jpg';
import ContemporaryThumb from '../../../images/thumb/Contemporary.jpg';
import CozyHomeThumb from '../../../images/thumb/CozyHome.jpg';
import DesertThumb from '../../../images/thumb/Desert.jpg';
import FishingThumb from '../../../images/thumb/Fishing.jpg';
import FlowerThumb from '../../../images/thumb/Flower.jpg';
import KitchenThumb from '../../../images/thumb/Kitchen.jpg';
import ModernHomeThumb from '../../../images/thumb/ModernHome.jpg';
import NatureThumb from '../../../images/thumb/Nature.jpg';
import OceanThumb from '../../../images/thumb/Ocean.jpg';
import PatioThumb from '../../../images/thumb/Patio.jpg';
import PlantThumb from '../../../images/thumb/Plant.jpg';
import SanFranciscoThumb from '../../../images/thumb/SanFrancisco.jpg';
import { Thumbnail } from '../../BackgroundSelectionDialog/BackgroundThumbnail/BackgroundThumbnail';

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

export const backgroundConfig = {
  imageNames,
  images,
};

const bgLibSettings = {
  assetsPath: '/virtualbackground',
};

let blurProcessor: GaussianBlurBackgroundProcessor;

export default function useBackgroundSettings(room: Room | undefined | null) {
  const [backgroundSettings, setBackgroundSettings] = useState({
    type: 'none',
    index: 0,
  } as BackgroundSettings);

  const updateBackgroundSettings = useCallback(
    async (settings: BackgroundSettings, force?: boolean, newRoom?: Room) => {
      room = room || newRoom;
      if (!room) {
        return;
      }
      const videoTrack = Array.from(room.localParticipant.videoTracks.values())[0].track;
      if (!videoTrack) {
        return;
      }
      const { type } = settings;
      if (type !== backgroundSettings.type || force) {
        if (type === 'none' && videoTrack.processor) {
          videoTrack.removeProcessor(videoTrack.processor);
        } else if (type === 'blur') {
          if (!blurProcessor) {
            blurProcessor = new GaussianBlurBackgroundProcessor({ ...bgLibSettings });
            (window as any).blurProcessor = blurProcessor;
            await blurProcessor.loadModel();
          }
          if (videoTrack.processor) {
            videoTrack.removeProcessor(videoTrack.processor);
          }
          videoTrack.addProcessor(blurProcessor);
        }
      } else if (type === 'image') {
        console.log('image click');
        if (videoTrack.processor) {
          videoTrack.removeProcessor(videoTrack.processor);
        }
      }

      const updatedSettings = {
        ...backgroundSettings,
        ...settings,
      };
      setBackgroundSettings(updatedSettings);
    },
    [backgroundSettings, setBackgroundSettings, room]
  );

  return [backgroundSettings, updateBackgroundSettings] as const;
}
