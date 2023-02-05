import { LocalVideoTrack, Room } from 'twilio-video';
import { useEffect, useCallback } from 'react';
import { SELECTED_MASK_SETTINGS_KEY } from '../../../constants';
import { isSupported } from '@twilio/video-processors';
import { Thumbnail } from '../../MaskSelectionDialog/MaskThumbnail/MaskThumbnail';
import { useLocalStorageState } from '../../../hooks/useLocalStorageState/useLocalStorageState';
import { MaskProcessor } from '../../../processors/face-mask/MaskProcessor';

import SantaImage from '../../../images/Santa.jpg';
import Santa2Image from '../../../images/Santa2.jpg';
import Santa3Image from '../../../images/Santa3.jpg';
import Santa4Image from '../../../images/Santa4.jpg';
import Scary1Image from '../../../images/Scary1.jpg';
import Scary2Image from '../../../images/Scary2.jpg';

export interface MaskSettings {
  type: Thumbnail;
  index?: number;
}

const imageNames: string[] = ['Santa', 'Santa 2', 'Santa 3', 'Santa 4', 'Scary 1', 'Scary 2'];

const rawImagePaths = [SantaImage, Santa2Image, Santa3Image, Santa4Image, Scary1Image, Scary2Image];

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
  images: rawImagePaths,
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
      if (!maskProcessor) {
        maskProcessor = new MaskProcessor({
          maskImage: await getImage(0),
        });
        await maskProcessor.loadModel();
      }

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
