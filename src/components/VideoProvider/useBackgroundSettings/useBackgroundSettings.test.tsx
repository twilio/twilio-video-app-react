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
let mockRoom: any;
let backgroundSettings: any;
let setBackgroundSettings: any;
let renderResult: any;

beforeEach(async () => {
  mockVideoTrack = {
    kind: 'video',
    processor: '',
    addProcessor: jest.fn(),
    removeProcessor: jest.fn(),
  };
  mockRoom = {
    localParticipant: 'participant',
  };
  const { result } = renderHook(() => useBackgroundSettings(mockVideoTrack as any, mockRoom));
  renderResult = result;
  [backgroundSettings, setBackgroundSettings] = renderResult.current;
  await act(async () => {
    setBackgroundSettings(defaultSettings);
  });
});

describe('The useBackgroundSettings hook ', () => {
  it('should return the backgroundsettings and update function.', () => {
    expect(renderResult.current).toEqual([defaultSettings, expect.any(Function)]);
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

  describe('The setBackgroundSettings function ', () => {
    it('should call videoTrack.removeProcessor if videoTrack and videoTrack.processor exists', async () => {
      mockVideoTrack = {
        kind: 'video',
        processor: 'processor',
        addProcessor: jest.fn(),
        removeProcessor: jest.fn(),
      };
      const { result } = renderHook(() => useBackgroundSettings(mockVideoTrack as any, mockRoom));
      renderResult = result;
      setBackgroundSettings = renderResult.current[1];
      await act(async () => {
        setBackgroundSettings(defaultSettings);
      });
      expect(mockVideoTrack.removeProcessor).toHaveBeenCalled();
      expect(window.localStorage.getItem(SELECTED_BACKGROUND_SETTINGS_KEY)).toEqual(JSON.stringify(defaultSettings));
    });

    it('should not call videoTrack.removeProcessor if videoTrack.processor does not exist', async () => {
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

    it('should not error when videoTrack does not exist and sets the local storage item', async () => {
      const { result } = renderHook(() => useBackgroundSettings({} as any, mockRoom));
      renderResult = result;
      setBackgroundSettings = renderResult.current[1];
      await act(async () => {
        setBackgroundSettings(defaultSettings);
      });
      expect(window.localStorage.getItem(SELECTED_BACKGROUND_SETTINGS_KEY)).toEqual(JSON.stringify(defaultSettings));
    });
  });
});
