import { RemoteParticipant } from 'twilio-video';
import { useEffect, useState } from 'react';
import useDominantSpeaker from '../useDominantSpeaker/useDominantSpeaker';
import { useAppState } from '../../state';
import useVideoContext from '../useVideoContext/useVideoContext';

//  If a participant that is not currently on the first page becomes
//  the dominant speaker, we move them to the first page where the least
//  recent dominant speaker was located. We are able to order the
//  participants appropriately by keeping track of the timestamp from when
//  they became the newest dominant speaker.

interface OrderedParticipant {
  participant: RemoteParticipant;
  dominantSpeakerStartTime: number;
}

export default function useGalleryViewParticipants(isMobileGalleryViewActive = false) {
  const { room } = useVideoContext();
  const dominantSpeaker = useDominantSpeaker();
  const { maxGalleryViewParticipants } = useAppState();
  const [orderedParticipants, setOrderedParticipants] = useState<OrderedParticipant[]>(
    Array.from(room?.participants?.values() ?? [], p => ({
      participant: p,
      dominantSpeakerStartTime: 0,
    }))
  );

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
          return prevParticipants;
        }

        // Here we use maxGalleryViewParticipants - 1 since the localParticipant will always be the first in the gallery
        const maxFirstPageParticipants = isMobileGalleryViewActive ? 5 : maxGalleryViewParticipants - 1;
        const firstPageParticipants = newParticipantsArray.slice(0, maxFirstPageParticipants);

        // if the newest dominant speaker is not currently on the first page, reorder the orderedParticipants array:
        if (!firstPageParticipants.some(p => p.participant === dominantSpeaker)) {
          // find the least recent dominant speaker by sorting the first page participants by their dominantSpeakerStartTime:
          const sortedFirstPageParticipants = firstPageParticipants.sort(
            (a, b) => a.dominantSpeakerStartTime - b.dominantSpeakerStartTime
          );
          const leastRecentDominantSpeaker = sortedFirstPageParticipants[0];

          /** Reorder the first page participants */
          // Temporarily remove the newest dominant speaker:
          newParticipantsArray.splice(newParticipantsArray.indexOf(newDominantSpeaker), 1);

          // Remove the least recent dominant speaker and replace them with the newest:
          newParticipantsArray.splice(newParticipantsArray.indexOf(leastRecentDominantSpeaker), 1, newDominantSpeaker);

          // Add the least recent dominant speaker back into the array after the last participant on the first page.
          newParticipantsArray.splice(maxFirstPageParticipants, 0, leastRecentDominantSpeaker);
        }
        return newParticipantsArray;
      });
    }
  }, [dominantSpeaker, maxGalleryViewParticipants, isMobileGalleryViewActive]);

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
