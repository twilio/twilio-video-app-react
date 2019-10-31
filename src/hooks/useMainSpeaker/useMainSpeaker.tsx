import { useVideoContext } from '../context';
import useDominantSpeaker from '../useDominantSpeaker/useDominantSpeaker';
import useParticipants from '../useParticipants/useParticipants';

export default function useMainSpeaker() {
  const { room } = useVideoContext();
  const participants = useParticipants();
  const dominantSpeaker = useDominantSpeaker();

  return dominantSpeaker || participants[0] || room.localParticipant;
}
