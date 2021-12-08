import { LanguageContext } from 'components/LanguageProvider';
import { useContext } from 'react';

export default function useLanguageContext() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguageContext must be used within a LanguageProvider');
  }
  return context;
}
