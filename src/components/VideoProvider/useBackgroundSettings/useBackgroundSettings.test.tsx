import { act, renderHook } from '@testing-library/react-hooks';
import { SELECTED_BACKGROUND_SETTINGS_KEY } from '../../../constants';
import useBackgroundSettings, { BackgroundSettings } from './useBackgroundSettings';
const mockLoadModel = jest.fn();

jest.mock('@twilio/video-processors', () => {
  return {
    GaussianBlurBackgroundProcessor: jest.fn().mockImplementation(() => {
      return {
        loadModel: mockLoadModel,
        // added name attribute for testing purposes
        name: 'GaussianBlurBackgroundProcessor',
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
  index: 0,
};

let mockVideoTrack: any;
let backgroundSettings: any;
let setBackgroundSettings: any;
let removeProcessor: any;
let renderResult: any;

beforeEach(async () => {
  mockVideoTrack = {
    kind: 'video',
    processor: '',
    addProcessor: jest.fn(),
    removeProcessor: jest.fn(),
  };
  const { result } = renderHook(() => useBackgroundSettings(mockVideoTrack as any));
  renderResult = result;
  [backgroundSettings, setBackgroundSettings, removeProcessor] = renderResult.current;
  await act(async () => {
    setBackgroundSettings(defaultSettings);
  });
});

describe('The useBackgroundSettings hook ', () => {
  it('should return the backgroundsettings and update function.', () => {
    expect(renderResult.current).toEqual([defaultSettings, expect.any(Function), expect.any(Function)]);
  });

  it('should set the background settings correctly and set the video processor when "blur" is selected', async () => {
    await act(async () => {
      setBackgroundSettings(blurSettings as BackgroundSettings);
    });
    backgroundSettings = renderResult.current[0];
    expect(backgroundSettings.type).toEqual('blur');
    expect(mockVideoTrack.addProcessor).toHaveBeenCalled();
  });

  it('should set the background settings correctly and remove the video processor when "none" is selected', async () => {
    await act(async () => {
      setBackgroundSettings(blurSettings as BackgroundSettings);
    });
    // set video processor to none
    await act(async () => {
      setBackgroundSettings(defaultSettings as BackgroundSettings);
    });
    backgroundSettings = renderResult.current[0];
    expect(backgroundSettings.type).toEqual('none');
  });

  it('should set the background settings correctly and set the video processor when "image" is selected', () => {
    // TODO add test after implementing virtual background feature/logic
  });

  describe('The removeProcessor function should ', () => {
    it('call videoTrack.removeProcessor if videoTrack and videoTrack.processor exist', () => {
      mockVideoTrack = {
        kind: 'video',
        processor: 'processor',
        addProcessor: jest.fn(),
        removeProcessor: jest.fn(),
      };
      const { result: renderResult } = renderHook(() => useBackgroundSettings(mockVideoTrack as any));
      removeProcessor = renderResult.current[2];
      removeProcessor();
      expect(mockVideoTrack.removeProcessor).toHaveBeenCalled();
    });

    it('should not call videoTrack.removeProcessor if either videoTrack or videoTrack.processor does not exist', () => {
      // case where videoTrack exists but not the processor
      expect(mockVideoTrack.removeProcessor).not.toHaveBeenCalled();
    });
  });

  describe('The setBackgroundSettings function should ', () => {
    it('call videoTrack.removeProcessor if videoTrack and videoTrack.processor exists', async () => {
      mockVideoTrack = {
        kind: 'video',
        processor: 'processor',
        addProcessor: jest.fn(),
        removeProcessor: jest.fn(),
      };
      const { result: renderResult } = renderHook(() => useBackgroundSettings(mockVideoTrack as any));
      setBackgroundSettings = renderResult.current[1];
      await act(async () => {
        setBackgroundSettings(defaultSettings);
      });
      expect(mockVideoTrack.removeProcessor).toHaveBeenCalled();
      expect(window.localStorage.getItem(SELECTED_BACKGROUND_SETTINGS_KEY)).toEqual(JSON.stringify(defaultSettings));
    });

    it('not call videoTrack.removeProcessor if videoTrack.processor does not exist', async () => {
      await act(async () => {
        setBackgroundSettings(blurSettings);
      });
      expect(mockVideoTrack.removeProcessor).not.toHaveBeenCalled();
      expect(window.localStorage.getItem(SELECTED_BACKGROUND_SETTINGS_KEY)).toEqual(JSON.stringify(blurSettings));
    });

    it("should not call videoTrack.addProcessor with a param of blurProcessor if backgroundSettings.type is not equal to 'blur'", async () => {
      mockVideoTrack.addProcessor.mockReset();
      const imgSettings = {
        type: 'image',
        index: 2,
      } as BackgroundSettings;
      await act(async () => {
        setBackgroundSettings(imgSettings);
      });
      expect(mockVideoTrack.addProcessor).not.toHaveBeenCalledWith({
        loadModel: mockLoadModel,
        name: 'GaussianBlurBackgroundProcessor',
      });
      expect(window.localStorage.getItem(SELECTED_BACKGROUND_SETTINGS_KEY)).toEqual(JSON.stringify(imgSettings));
    });
  });
});
