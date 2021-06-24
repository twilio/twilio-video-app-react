import { useState } from 'react';
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

// TODO : Add video processing logic after backgroundSettings change
// useEffect hooks, etc ...

export default function useBackgroundSettings() {
  const [backgroundSettings, setBackgroundSettings] = useState({
    type: 'none',
    index: 0,
  } as BackgroundSettings);
  return [backgroundSettings, setBackgroundSettings] as const;
}
