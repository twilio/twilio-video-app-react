import { useContext } from 'react';
import { ParticipantContext } from '../../components/ParticipantProvider';

export default function useParticipantContext() {
  const context = useContext(ParticipantContext);
  if (!context) {
    throw new Error('useParticipantContext must be used within a ParticipantProvider');
  }
  return context;
}
