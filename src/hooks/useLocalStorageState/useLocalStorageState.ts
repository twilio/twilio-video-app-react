import React, { useEffect, useState } from 'react';

/* This hook is like a useState() hook, but it will store the state in LocalStorage.
   If a value exists in LocalStorage, it will be returned as the initial value when
   this hook is run for the first time. Because this hook uses LocalStorage, it can 
   only use values that can be serialized to and from JSON.
*/

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
  }, [key, value]);

  return [value, setValue] as const;
}
