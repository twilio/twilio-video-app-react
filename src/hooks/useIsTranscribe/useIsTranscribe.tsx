import { useState } from 'react';

export default function useIsTranscribe() {
  const [isTranscribe, setIsTranscribe] = useState<boolean>(false);

  return [isTranscribe, setIsTranscribe] as const;
}
