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

const BG_SETTINGS_KEY = 'bgsettings5';

let blurProcessor: GaussianBlurBackgroundProcessor;

export default function useBackgroundSettings(room: Room | undefined | null) {
  let currentSettings: BackgroundSettings;
  const localStorageSetting = window.localStorage.getItem(BG_SETTINGS_KEY);
  currentSettings = localStorageSetting ? JSON.parse(localStorageSetting!) : { type: 'none', index: 0 };

  const [backgroundSettings, setBackgroundSettings] = useState<BackgroundSettings>(currentSettings);

  const updateSettings = (settings: BackgroundSettings): void => {
    setBackgroundSettings(settings);
    window.localStorage.setItem(BG_SETTINGS_KEY, JSON.stringify(settings));
  };

  const updateBackgroundSettings = useCallback(
    async (settings: BackgroundSettings, reset?: boolean, force?: boolean, newRoom?: Room) => {
      // reset, used for resetting background settings when camera is off/no video tracks
      let currentRoom = room;
      if (reset) {
        updateSettings({ type: 'none' });
        return;
      }
      currentRoom = currentRoom || newRoom;
      if (!currentRoom) {
        return;
      }

      const videoTrackValue = Array.from(currentRoom.localParticipant.videoTracks.values())[0];
      if (!videoTrackValue) {
        return;
      }
      const videoTrack = videoTrackValue.track;
      const { type } = settings;
      if (type !== backgroundSettings.type || force) {
        if (type === 'none' && videoTrack.processor) {
          videoTrack.removeProcessor(videoTrack.processor);
        } else if (type === 'blur') {
          if (!blurProcessor) {
            blurProcessor = new GaussianBlurBackgroundProcessor({ ...bgLibSettings });
            await blurProcessor.loadModel();
          }
          if (videoTrack.processor) {
            videoTrack.removeProcessor(videoTrack.processor);
          }
          videoTrack.addProcessor(blurProcessor);
        } else {
          // TODO currently just removes processor, implement background image replacement logic
          if (videoTrack.processor) {
            videoTrack.removeProcessor(videoTrack.processor);
          }
        }
      }
      updateSettings(settings);
    },
    [backgroundSettings, room]
  );

  return [backgroundSettings, updateBackgroundSettings] as const;
}
