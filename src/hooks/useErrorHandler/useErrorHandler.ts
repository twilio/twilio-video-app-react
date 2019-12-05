import { useVideoContext } from '../context';

export default function useErrorHandler() {
  const { onError } = useVideoContext();

  return onError;
}
