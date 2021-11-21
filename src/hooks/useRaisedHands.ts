import { useContext } from 'react';
import { RaisedHandsContext } from '../components/RaisedHandsProvider';

export default function useRaisedHands() {
  const context = useContext(RaisedHandsContext);
  if (!context) {
    throw new Error('useRaisedHands must be used within a RaisedHandsProvider');
  }
  return context;
}
