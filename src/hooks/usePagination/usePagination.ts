import { useState, useEffect } from 'react';
import { Participant } from 'twilio-video';
import { useAppState } from '../../state';

export function usePagination(participants: Participant[]) {
  const [currentPage, setCurrentPage] = useState(1); // Pages are 1 indexed
  const { maxGridParticipants } = useAppState();

  const totalPages = Math.ceil(participants.length / maxGridParticipants);
  const isLastPage = currentPage === totalPages;
  const isBeyondLastPage = currentPage > totalPages;

  useEffect(() => {
    if (isBeyondLastPage) {
      setCurrentPage(totalPages);
    }
  }, [isBeyondLastPage, totalPages]);

  let paginatedParticipants;

  if (isLastPage) {
    paginatedParticipants = participants.slice(-maxGridParticipants);
  } else {
    paginatedParticipants = participants.slice(
      (currentPage - 1) * maxGridParticipants,
      currentPage * maxGridParticipants
    );
  }

  return { paginatedParticipants, setCurrentPage, currentPage, totalPages };
}
