import { act, renderHook } from '@testing-library/react-hooks';
import { SELECTED_MASK_SETTINGS_KEY } from '../../../constants';
import useMaskSettings, { MaskSettings } from './useMaskSettings';

const mockLoadModel = jest.fn();
let mockIsSupported = true;
jest.mock('@twilio/video-processors', () => {
  return {
    GaussianBlurBackgroundProcessor: jest.fn().mockImplementation(() => {
      return {
        loadModel: mockLoadModel,
        // added name attribute for testing purposes
        name: 'GaussianBlurBackgroundProcessor',
      };
    }),
    VirtualBackgroundProcessor: jest.fn().mockImplementation(() => {
      return {
        loadModel: mockLoadModel,
        backgroundImage: '',
        name: 'VirtualBackgroundProcessor',
      };
    }),
    ImageFit: {
      Cover: 'Cover',
    },
    get isSupported() {
      return mockIsSupported;
    },
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

const imgSettings = {
  type: 'image',
  index: 2,
};

const globalAny: any = global;

globalAny.Image = jest.fn().mockImplementation(() => {
  return {
    set src(newSrc: String) {
      this.onload();
    },
  };
});

let mockVideoTrack: any;
let mockRoom: any;
let MaskSettings: any;
let setMaskSettings: any;
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
  const { result } = renderHook(() => useMaskSettings(mockVideoTrack as any, mockRoom));
  renderResult = result;
  mockIsSupported = true;
  [MaskSettings, setMaskSettings] = renderResult.current;
  await act(async () => {
    setMaskSettings(defaultSettings);
  });
});

describe('The useMaskSettings hook ', () => {
  it('should not call loadModel, addProcessor, or removeProcessor if isSupported is false', async () => {
    mockIsSupported = false;
    mockLoadModel.mockReset();
    // update MaskSettings to trigger useEffect hook
    await act(async () => {
      setMaskSettings(blurSettings);
    });
    expect(mockLoadModel).not.toHaveBeenCalled();
    expect(mockVideoTrack.addProcessor).not.toHaveBeenCalled();
    expect(mockVideoTrack.removeProcessor).not.toHaveBeenCalled();
  });

  it('should return the MaskSettings and update function.', () => {
    expect(renderResult.current).toEqual([defaultSettings, expect.any(Function)]);
  });

  it('should set the background settings correctly and set the video processor when "blur" is selected', async () => {
    await act(async () => {
      setMaskSettings(blurSettings as MaskSettings);
    });
    MaskSettings = renderResult.current[0];
    expect(MaskSettings.type).toEqual('blur');
    expect(mockVideoTrack.addProcessor).toHaveBeenCalledWith({
      loadModel: mockLoadModel,
      name: 'GaussianBlurBackgroundProcessor',
    });
  });

  it('should set the background settings correctly and remove the video processor when "none" is selected', async () => {
    await act(async () => {
      setMaskSettings(blurSettings as MaskSettings);
    });
    // set video processor to none
    await act(async () => {
      setMaskSettings(defaultSettings as MaskSettings);
    });
    MaskSettings = renderResult.current[0];
    expect(MaskSettings.type).toEqual('none');
  });

  it('should set the background settings correctly and set the video processor when "image" is selected', async () => {
    await act(async () => {
      setMaskSettings(imgSettings as MaskSettings);
    });
    MaskSettings = renderResult.current[0];
    expect(MaskSettings.type).toEqual('image');
    expect(MaskSettings.index).toEqual(2);
    expect(mockVideoTrack.addProcessor).toHaveBeenCalledWith({
      backgroundImage: expect.any(Object),
      loadModel: mockLoadModel,
      name: 'VirtualBackgroundProcessor',
    });
  });

  describe('The setMaskSettings function ', () => {
    it('should call videoTrack.removeProcessor if videoTrack and videoTrack.processor exists', async () => {
      mockVideoTrack = {
        kind: 'video',
        processor: 'processor',
        addProcessor: jest.fn(),
        removeProcessor: jest.fn(),
      };
      const { result } = renderHook(() => useMaskSettings(mockVideoTrack as any, mockRoom));
      renderResult = result;
      setMaskSettings = renderResult.current[1];
      await act(async () => {
        setMaskSettings(defaultSettings);
      });
      expect(mockVideoTrack.removeProcessor).toHaveBeenCalled();
      expect(window.localStorage.getItem(SELECTED_MASK_SETTINGS_KEY)).toEqual(JSON.stringify(defaultSettings));
    });

    it('should not call videoTrack.removeProcessor if videoTrack.processor does not exist', async () => {
      await act(async () => {
        setMaskSettings(blurSettings);
      });
      expect(mockVideoTrack.removeProcessor).not.toHaveBeenCalled();
      expect(window.localStorage.getItem(SELECTED_MASK_SETTINGS_KEY)).toEqual(JSON.stringify(blurSettings));
    });

    it("should not call videoTrack.addProcessor with a param of blurProcessor if MaskSettings.type is not equal to 'blur'", async () => {
      mockVideoTrack.addProcessor.mockReset();
      await act(async () => {
        setMaskSettings(imgSettings);
      });
      expect(mockVideoTrack.addProcessor).not.toHaveBeenCalledWith({
        loadModel: mockLoadModel,
        name: 'GaussianBlurBackgroundProcessor',
      });
      expect(window.localStorage.getItem(SELECTED_MASK_SETTINGS_KEY)).toEqual(JSON.stringify(imgSettings));
    });

    it("should not call videoTrack.addProcessor with a param of virtualBackgroundProcessor if MaskSettings.type is not equal to 'image'", async () => {
      mockVideoTrack.addProcessor.mockReset();
      await act(async () => {
        setMaskSettings(blurSettings);
      });
      expect(mockVideoTrack.addProcessor).not.toHaveBeenCalledWith({
        loadModel: mockLoadModel,
        backgroundImage: expect.any(Object),
        name: 'VirtualBackgroundProcessor',
      });
      expect(window.localStorage.getItem(SELECTED_MASK_SETTINGS_KEY)).toEqual(JSON.stringify(blurSettings));
    });

    it('should not error when videoTrack does not exist and sets the local storage item', async () => {
      const { result } = renderHook(() => useMaskSettings({} as any, mockRoom));
      renderResult = result;
      setMaskSettings = renderResult.current[1];
      await act(async () => {
        setMaskSettings(defaultSettings);
      });
      expect(window.localStorage.getItem(SELECTED_MASK_SETTINGS_KEY)).toEqual(JSON.stringify(defaultSettings));
    });
  });
});
