import { LocalVideoTrack, Room } from 'twilio-video';
import { useEffect, useCallback } from 'react';
import { SELECTED_MASK_SETTINGS_KEY } from '../../../constants';
import { isSupported } from '@twilio/video-processors';
// TODO: replace these mock photos with actual face masks
import Abstract from '../../../images/Abstract.jpg';
import AbstractThumb from '../../../images/thumb/Abstract.jpg';
import BohoHome from '../../../images/BohoHome.jpg';
import BohoHomeThumb from '../../../images/thumb/BohoHome.jpg';
import { Thumbnail } from '../../MaskSelectionDialog/MaskThumbnail/MaskThumbnail';
import { useLocalStorageState } from '../../../hooks/useLocalStorageState/useLocalStorageState';
import { MaskProcessor } from '../../../processors/face-mask/MaskProcessor';

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

let maskProcessor: MaskProcessor;

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
    (processor: MaskProcessor) => {
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
      maskProcessor = new MaskProcessor({
        maskImage: await getImage(0),
      });
      if (!room?.localParticipant) {
        return;
      }

      if (maskSettings.type === 'image' && typeof maskSettings.index === 'number') {
        maskProcessor.maskImage = await getImage(maskSettings.index);
        addProcessor(maskProcessor);
      } else {
        removeProcessor();
      }
    };
    handleProcessorChange();
  }, [maskSettings, videoTrack, room, addProcessor, removeProcessor]);

  return [maskSettings, setMaskSettings] as const;
}
