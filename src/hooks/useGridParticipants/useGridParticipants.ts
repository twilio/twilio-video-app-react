import { RemoteParticipant } from 'twilio-video';
import { useEffect, useState } from 'react';
import useDominantSpeaker from '../useDominantSpeaker/useDominantSpeaker';
import { useAppState } from '../../state';
import useVideoContext from '../useVideoContext/useVideoContext';

// If an offscreen participant becomes the dominant speaker, we
// move them onscreen to where the least recent onscreen dominant
// speaker was located. We are able to order the speakers appropriately
// by keeping track of the timestamp from when they became the newest
// dominant speaker.

interface OrderedParticipant {
  participant: RemoteParticipant;
  dominantSpeakerStartTime: number;
}

export default function useGridParticipants() {
  const [orderedParticipants, setOrderedParticipants] = useState<OrderedParticipant[]>([]);
  const { room } = useVideoContext();
  const dominantSpeaker = useDominantSpeaker(true);
  const { maxGridParticipants } = useAppState();

  useEffect(() => {
    if (dominantSpeaker !== null) {
      setOrderedParticipants(prevParticipants => {
        const newParticipantsArray = prevParticipants.slice();

        const newDominantSpeaker = newParticipantsArray.find(p => p.participant === dominantSpeaker);
        // it's possible that the dominantSpeaker is removed from the newParticipantsArray before they become null:
        if (newDominantSpeaker) {
          // update the participant's dominantSpeakerStartTime to when they became the new dominant speaker:
          newDominantSpeaker.dominantSpeakerStartTime = Date.now();
        } else {
          return newParticipantsArray;
        }

        // Here we use maxGridParticipants - 1 since the localParticipant will always be the first in the grid
        let maxOnScreenParticipants = maxGridParticipants - 1;
        const onscreenParticipants = newParticipantsArray.slice(0, maxOnScreenParticipants);

        // if the newest dominant speaker is not currently on screen, reorder the orderedParticipants array:
        if (!onscreenParticipants.some(p => p.participant === dominantSpeaker)) {
          // find the least recent dominant speaker by sorting the onscreen speakers by their dominantSpeakerStartTime:
          const sortedOnscreenParticipants = onscreenParticipants.sort(
            (a, b) => a.dominantSpeakerStartTime - b.dominantSpeakerStartTime
          );
          const leastRecentDominantSpeaker = sortedOnscreenParticipants[0];
          const newDominantSpeakerWithStartTime = newParticipantsArray.find(p => p.participant === dominantSpeaker);

          /** Reorder the onscreen participants */
          // Temporarily remove the newest dominant speaker:
          newParticipantsArray.splice(newParticipantsArray.indexOf(newDominantSpeakerWithStartTime!), 1);
          // Remove the least recent dominant speaker and replace them with the newest:
          newParticipantsArray.splice(
            newParticipantsArray.indexOf(leastRecentDominantSpeaker),
            1,
            newDominantSpeakerWithStartTime!
          );
          // Add the least recent dominant speaker back into the  array at the end:
          newParticipantsArray.splice(maxGridParticipants - 1, 0, leastRecentDominantSpeaker);
        }
        return newParticipantsArray;
      });
    }
  }, [dominantSpeaker, maxGridParticipants]);

  useEffect(() => {
    if (room) {
      const participantArray = Array.from(room.participants.values(), p => ({
        participant: p,
        dominantSpeakerStartTime: 0,
      }));
      setOrderedParticipants(participantArray);

      const handleParticipantConnected = (participant: RemoteParticipant) => {
        setOrderedParticipants(prevParticipants => [...prevParticipants, { participant, dominantSpeakerStartTime: 0 }]);
      };

      const handleParticipantDisconnected = (participant: RemoteParticipant) => {
        setOrderedParticipants(prevParticipants => prevParticipants.filter(p => p.participant !== participant));
      };

      room.on('participantConnected', handleParticipantConnected);
      room.on('participantDisconnected', handleParticipantDisconnected);
      return () => {
        room.off('participantConnected', handleParticipantConnected);
        room.off('participantDisconnected', handleParticipantDisconnected);
      };
    }
  }, [room]);

  return orderedParticipants.map(p => p.participant);
}
