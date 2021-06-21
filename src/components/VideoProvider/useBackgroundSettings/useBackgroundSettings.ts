import { useState } from 'react';
import { Thumbnail } from '../../BackgroundSelectionDialog/BackgroundThumbnail/BackgroundThumbnail';

export interface BackgroundSettings {
  type?: Thumbnail;
  index?: number;
}

const defaultSettings: BackgroundSettings = {
  type: 'none',
  index: 0,
};

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
  'Palm Trees',
  'Plant',
  'San Francisco',
];

const images = imageNames.map(name => `/images/${name.replace(' ', '')}.jpg`);

export const backgroundConfig = {
  imageNames,
  images,
};

export default function useBackgroundSettings() {
  let currentSettings = defaultSettings;
  const [backgroundSettings, setBackgroundSettings] = useState(currentSettings);
  return [backgroundSettings, setBackgroundSettings] as const;
}
