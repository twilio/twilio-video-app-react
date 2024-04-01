import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export default function useSearchParams() {
  const { search } = useLocation();
  return { searchParams: useMemo(() => new URLSearchParams(search), [search]) };
}
