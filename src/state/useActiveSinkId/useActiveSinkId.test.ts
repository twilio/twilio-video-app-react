import { act, renderHook } from '@testing-library/react-hooks';
import { SELECTED_AUDIO_OUTPUT_KEY } from '../../constants';
import useActiveSinkId from './useActiveSinkId';
import { useAudioOutputDevices } from '../../hooks/deviceHooks/deviceHooks';

jest.mock('../../hooks/deviceHooks/deviceHooks');
const mockUseAudioOutputDevices = useAudioOutputDevices as jest.Mock<any>;

mockUseAudioOutputDevices.mockImplementation(() => []);

describe('the useActiveSinkId hook', () => {
  beforeEach(() => window.localStorage.clear());

  it('should return "default" by default', () => {
    const { result } = renderHook(useActiveSinkId);
    expect(result.current[0]).toBe('default');
  });

  it('should return the saved device ID when a corresponding device exists', () => {
    window.localStorage.setItem(SELECTED_AUDIO_OUTPUT_KEY, 'mockAudioOutputDeviceID');
    const { result, rerender } = renderHook(useActiveSinkId);

    mockUseAudioOutputDevices.mockImplementationOnce(() => [{ deviceId: 'mockAudioOutputDeviceID' }]);
    rerender();

    expect(result.current[0]).toBe('mockAudioOutputDeviceID');
  });

  it('should return "default" when there is a saved device ID but a corresponding device does not exist', () => {
    window.localStorage.setItem(SELECTED_AUDIO_OUTPUT_KEY, 'anotherMockAudioOutputDeviceID');
    const { result, rerender } = renderHook(useActiveSinkId);

    mockUseAudioOutputDevices.mockImplementationOnce(() => [{ deviceId: 'mockAudioOutputDeviceID' }]);
    rerender();

    expect(result.current[0]).toBe('default');
  });

  it('should save the device ID in localStorage when it is set', () => {
    const { result } = renderHook(useActiveSinkId);
    act(() => {
      result.current[1]('newMockAudioOutputDeviceID');
    });
    expect(window.localStorage.getItem(SELECTED_AUDIO_OUTPUT_KEY)).toBe('newMockAudioOutputDeviceID');
  });
});
