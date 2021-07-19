import { LocalVideoTrack } from 'twilio-video';
import { useState, useEffect } from 'react';
import { SELECTED_BACKGROUND_SETTINGS_KEY } from '../../../constants';
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

export default function useBackgroundSettings(videoTrack: LocalVideoTrack | undefined) {
  const [backgroundSettings, setBackgroundSettings] = useState<BackgroundSettings>(() => {
    const localStorageSettings = window.localStorage.getItem(SELECTED_BACKGROUND_SETTINGS_KEY);
    return localStorageSettings ? JSON.parse(localStorageSettings) : { type: 'none', index: 0 };
  });

  // Specifically used for handling room disconnection
  const removeProcessor = (): void => {
    if (videoTrack && videoTrack.processor) {
      videoTrack.removeProcessor(videoTrack.processor);
    }
  };

  useEffect(() => {
    if (!blurProcessor) {
      blurProcessor = new GaussianBlurBackgroundProcessor({
        assetsPath: virtualBackgroundAssets,
      });
      blurProcessor.loadModel();
    }
  }, []);

  useEffect(() => {
    if (videoTrack) {
      if (videoTrack.processor) {
        videoTrack.removeProcessor(videoTrack.processor);
      }
      if (backgroundSettings.type === 'blur') {
        videoTrack.addProcessor(blurProcessor);
      } else if (backgroundSettings.type === 'image') {
        // TODO implement image background replacement logic
      }
    }
    window.localStorage.setItem(SELECTED_BACKGROUND_SETTINGS_KEY, JSON.stringify(backgroundSettings));
  }, [backgroundSettings, videoTrack]);

  return [backgroundSettings, setBackgroundSettings, removeProcessor] as const;
}
