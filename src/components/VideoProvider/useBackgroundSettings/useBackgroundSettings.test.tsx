import { act, renderHook } from '@testing-library/react-hooks';
import useBackgroundSettings, { BackgroundSettings } from './useBackgroundSettings';
const mockLoadModel = jest.fn();

jest.mock('@twilio/video-processors', () => {
  return {
    GaussianBlurBackgroundProcessor: jest.fn().mockImplementation(() => {
      return {
        loadModel: mockLoadModel,
      };
    }),
  };
});

const defaultSettings = {
  type: 'none',
  index: 0,
};

const blurSettings = {
  type: 'blur',
};

describe('The useBackgroundSettings hook ', () => {
  let mockVideoTrack: any;
  beforeEach(() => {
    mockVideoTrack = {
      kind: 'video',
      processor: '',
      addProcessor: jest.fn(),
      removeProcessor: jest.fn(),
    };
  });

  it('should return the backgroundsettings and update function.', () => {
    const { result } = renderHook(() => useBackgroundSettings(mockVideoTrack as any));
    expect(result.current).toEqual([defaultSettings, expect.any(Function), expect.any(Function)]);
  });

  it('should set the background settings correctly and set the video processor when "blur" is selected', async () => {
    const { result } = renderHook(() => useBackgroundSettings(mockVideoTrack as any));
    await act(async () => {
      result.current[1](blurSettings as BackgroundSettings);
    });
    expect(result.current[0].type).toEqual('blur');
    expect(mockVideoTrack.addProcessor).toHaveBeenCalled();
  });

  it('should set the background settings correctly and remove the video processor when "none" is selected', async () => {
    const { result } = renderHook(() => useBackgroundSettings(mockVideoTrack as any));
    // set video processor to non-null value
    await act(async () => {
      result.current[1](blurSettings as BackgroundSettings);
    });
    // set video processor to none
    await act(async () => {
      result.current[1](defaultSettings as BackgroundSettings);
    });
    expect(mockVideoTrack.addProcessor).toHaveBeenCalled();
    expect(result.current[0].type).toEqual('none');
  });

  it('should set the background settings correctly and set the video processor when "image" is selected', () => {
    // TODO add test after implementing virtual background feature/logic
  });
});
