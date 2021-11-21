import { useContext } from 'react';
import { AdminWindowContext } from '../components/AdminWindowProvider';

export default function useAdminWindow() {
  const context = useContext(AdminWindowContext);
  if (!context) {
    throw new Error('useRaisedHands must be used within a RaisedHandsProvider');
  }
  return context;
}
