import { useCallback, useEffect, useState } from 'react';
const TOKEN_URL_KEY = 'TOKEN_URL_KEY';

export default function useTokenEndpoint() {
  const [tokenEndpoint, _setTokenEndpoint] = useState('');

  const setTokenEndpoint = useCallback(
    (tokenEndpoint: string) => {
      window.localStorage.setItem(TOKEN_URL_KEY, tokenEndpoint);
      _setTokenEndpoint(tokenEndpoint);
    },
    [_setTokenEndpoint]
  );

  useEffect(() => {
    const selectedTokenEndpoint = window.localStorage.getItem(TOKEN_URL_KEY);
    _setTokenEndpoint(selectedTokenEndpoint!);
  });

  return [tokenEndpoint, setTokenEndpoint] as const;
}
