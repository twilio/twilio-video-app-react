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

export default function useBackgroundSettings() {
  let currentSettings = defaultSettings;
  const [backgroundSettings, setBackgroundSettings] = useState(currentSettings);
  return [backgroundSettings, setBackgroundSettings] as const;
}
