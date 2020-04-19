import useVideoContext from '../useVideoContext/useVideoContext';

export function useLocalAudioDisabledCheck() {
  const { room } = useVideoContext();
  const localParticipant = room.localParticipant;
  const participants = room.participants;
  let hasPhone = false;

  if (room && room.localParticipant && participants) {
    participants.forEach(p => {
      if (p.identity.split('|')[0] === localParticipant.identity.split('|')[0] + '.phone') {
        hasPhone = true;
      }
    });
  }

  return hasPhone;
}
