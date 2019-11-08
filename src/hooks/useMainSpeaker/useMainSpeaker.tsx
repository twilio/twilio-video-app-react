import { useVideoContext } from '../context';
import useDominantSpeaker from '../useDominantSpeaker/useDominantSpeaker';
import useParticipants from '../useParticipants/useParticipants';
import useScreenShareParticipant from '../useScreenShareParticipant/useScreenShareParticipant';

export default function useMainSpeaker() {
  const {
    room: { localParticipant },
  } = useVideoContext();
  const screenShareParticipant = useScreenShareParticipant();
  const dominantSpeaker = useDominantSpeaker();
  const participants = useParticipants();

  return screenShareParticipant || dominantSpeaker || participants[0] || localParticipant;
}
