import React, { useEffect, useState } from 'react';

export function useLocalStorageState<T = undefined>(
  key: string,
  initialState: T | undefined
): [T, React.Dispatch<React.SetStateAction<T | undefined>>];
export function useLocalStorageState<T>(key: string, initialState: T) {
  const [value, setValue] = useState(() => {
    const item = window.localStorage.getItem(key);
    if (item !== null) {
      return JSON.parse(item) as T;
    } else {
      return initialState;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [value]);

  return [value, setValue] as const;
}
