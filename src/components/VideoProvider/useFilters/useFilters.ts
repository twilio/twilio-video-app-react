import { LocalVideoTrack, Room } from 'twilio-video';
import { useCallback, useState } from 'react';
import {GrayscaleProcessor, BlurProcessor} from '../../../utils/processor';

const grayscale = new GrayscaleProcessor();
const blur = new BlurProcessor();

export enum Filters {
  Grayscale = 'grayscale',
  Blur = 'blur',
  None = 'none',
}

export function useFilters(room: Room) {
  const [currentFilter, setCurrentFilter] = useState(Filters.None);

  const setFilter = useCallback((filter?: Filters, track?: LocalVideoTrack) => {
    const videoTrack = track || Array.from(room.localParticipant.videoTracks.values())[0].track;
    filter = filter || currentFilter;
    setCurrentFilter(filter);

    if (videoTrack.processor) {
      videoTrack.removeProcessor(videoTrack.processor);
    }
    if (filter === Filters.Grayscale) {
      videoTrack.addProcessor(grayscale);
    } else if (filter === Filters.Blur) {
      videoTrack.addProcessor(blur);
    }
  }, [currentFilter, setCurrentFilter, room]);

  return setFilter;
}
