import { useContext } from 'react';
import { SessionContext } from '../components/SessionProvider';

export default function useSessionContext() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSessionContext must be used within a SessionProvider');
  }
  return context;
}
