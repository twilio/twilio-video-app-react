import { useState } from 'react';
import Abstract from '../../../../public/images/Abstract.jpg';
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

const images = imageNames.map(name => `/images/${name.replace(' ', '')}.jpg`);

const images1 = [Abstract];

export const backgroundConfig = {
  imageNames,
  images,
};

export default function useBackgroundSettings() {
  const [backgroundSettings, setBackgroundSettings] = useState({
    type: 'none',
    index: 0,
  });
  return [backgroundSettings, setBackgroundSettings] as const;
}
