import { LocalVideoTrack } from 'twilio-video';
import { useCallback, useState, useEffect } from 'react';
import { BG_SETTINGS_KEY } from '../../../constants';
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

const virtualBackgroundAssets = '/virtualbackground';

let blurProcessor: GaussianBlurBackgroundProcessor;

export default function useBackgroundSettings(videoTrack: LocalVideoTrack) {
  const [backgroundSettings, setBackgroundSettings] = useState<BackgroundSettings>(() => {
    const localStorageSettings = window.localStorage.getItem(BG_SETTINGS_KEY);
    return localStorageSettings ? JSON.parse(localStorageSettings) : { type: 'none', index: 0 };
  });

  // load processors on initialization
  useEffect(() => {
    if (!blurProcessor) {
      blurProcessor = new GaussianBlurBackgroundProcessor({
        assetsPath: virtualBackgroundAssets,
      });
      blurProcessor.loadModel();
    }
  }, []);

  // for reapplying background replacement after camera is toggled on again
  useEffect(() => {
    const storedBackgroundSettings = window.localStorage.getItem(BG_SETTINGS_KEY);
    if (videoTrack && storedBackgroundSettings) {
      const parsedSettings = JSON.parse(storedBackgroundSettings!);
      if (parsedSettings.type === 'blur') {
        videoTrack.addProcessor(blurProcessor);
      }
    }
  }, [videoTrack]);

  // update the backgroundSettings and save into localStorage
  const updateSettings = (settings: BackgroundSettings): void => {
    setBackgroundSettings(settings);
    window.localStorage.setItem(BG_SETTINGS_KEY, JSON.stringify(settings));
  };

  const updateBackgroundSettings = useCallback(
    async (settings: BackgroundSettings) => {
      // check if new background settings have been selected
      if (settings.type !== backgroundSettings.type) {
        // remove processor
        if (videoTrack.processor) {
          videoTrack.removeProcessor(videoTrack.processor);
        }
        if (settings.type === 'blur') {
          videoTrack.addProcessor(blurProcessor);
        } else if (settings.type === 'image') {
          // TODO add image replacement logic
        }
        updateSettings(settings);
      }
    },
    [backgroundSettings, videoTrack]
  );

  return [backgroundSettings, updateBackgroundSettings] as const;
}
