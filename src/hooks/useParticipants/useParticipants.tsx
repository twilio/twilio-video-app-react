import useSessionContext from 'hooks/useSessionContext';
import { useEffect, useState } from 'react';
import { RemoteParticipant } from 'twilio-video';
import { categorizeParticipants } from 'utils/participants';
// import useDominantSpeaker from '../useDominantSpeaker/useDominantSpeaker';
import useVideoContext from '../useVideoContext/useVideoContext';

export default function useParticipants() {
  const { room } = useVideoContext();
  const [participants, setParticipants] = useState(Array.from(room?.participants.values() ?? []));
  const { moderators } = useSessionContext();
  const localParticipant = room!.localParticipant;
  // const dominantSpeaker = useDominantSpeaker();

  // When the dominant speaker changes, they are moved to the front of the participants array.
  // This means that the most recent dominant speakers will always be near the top of the
  // ParticipantStrip component.
  // useEffect(() => {
  //   if (dominantSpeaker) {
  //     setParticipants(prevParticipants => [
  //       dominantSpeaker,
  //       ...prevParticipants.filter(participant => participant !== dominantSpeaker),
  //     ]);
  //   }
  // }, [dominantSpeaker]);

  useEffect(() => {
    if (room) {
      const participantConnected = (participant: RemoteParticipant) =>
        setParticipants(prevParticipants => [...prevParticipants, participant]);
      const participantDisconnected = (participant: RemoteParticipant) =>
        setParticipants(prevParticipants => prevParticipants.filter(p => p !== participant));
      room.on('participantConnected', participantConnected);
      room.on('participantDisconnected', participantDisconnected);
      return () => {
        room.off('participantConnected', participantConnected);
        room.off('participantDisconnected', participantDisconnected);
      };
    }
  }, [room]);

  return { ...categorizeParticipants(participants, localParticipant, moderators), localParticipant };
}
