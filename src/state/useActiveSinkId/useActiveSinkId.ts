import { useCallback, useEffect, useState } from 'react';
import { SELECTED_AUDIO_OUTPUT_KEY } from '../../constants';
import useDevices from '../../hooks/useDevices/useDevices';

export default function useActiveSinkId() {
  const { audioOutputDevices } = useDevices();
  const [activeSinkId, _setActiveSinkId] = useState('default');

  const setActiveSinkId = useCallback((sinkId: string) => {
    window.localStorage.setItem(SELECTED_AUDIO_OUTPUT_KEY, sinkId);
    _setActiveSinkId(sinkId);
  }, []);

  useEffect(() => {
    const selectedSinkId = window.localStorage.getItem(SELECTED_AUDIO_OUTPUT_KEY);
    const hasSelectedAudioOutputDevice = audioOutputDevices.some(
      device => selectedSinkId && device.deviceId === selectedSinkId
    );
    if (hasSelectedAudioOutputDevice) {
      _setActiveSinkId(selectedSinkId!);
    }
  }, [audioOutputDevices]);

  return [activeSinkId, setActiveSinkId] as const;
}
