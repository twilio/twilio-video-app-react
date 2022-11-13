import { act, renderHook } from '@testing-library/react-hooks';
import { SELECTED_MASK_SETTINGS_KEY } from '../../../constants';
import useMaskSettings, { MaskSettings } from './useMaskSettings';

const mockLoadModel = jest.fn();
let mockIsSupported = true;
jest.mock('mask processor', () => {
  return {
    MaskProcessor: jest.fn().mockImplementation(() => {
      return {
        loadModel: mockLoadModel,
        maskImage: '',
        name: 'MaskProcessor',
      };
    }),
    get isSupported() {
      return mockIsSupported;
    },
  };
});

const defaultSettings = {
  type: 'none',
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
let maskSettings: any;
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
  [maskSettings, setMaskSettings] = renderResult.current;
  await act(async () => {
    setMaskSettings(defaultSettings);
  });
});

describe('The useMaskSettings hook ', () => {
  it('should not call loadModel, addProcessor, or removeProcessor if isSupported is false', async () => {
    mockIsSupported = false;
    mockLoadModel.mockReset();
    // update maskSettings to trigger useEffect hook
    await act(async () => {
      setMaskSettings(defaultSettings);
    });
    expect(mockLoadModel).not.toHaveBeenCalled();
    expect(mockVideoTrack.addProcessor).not.toHaveBeenCalled();
    expect(mockVideoTrack.removeProcessor).not.toHaveBeenCalled();
  });

  it('should return the maskSettings and update function.', () => {
    expect(renderResult.current).toEqual([defaultSettings, expect.any(Function)]);
  });

  it('should set the mask settings correctly and set the video processor when "image" is selected', async () => {
    await act(async () => {
      setMaskSettings(imgSettings as MaskSettings);
    });
    maskSettings = renderResult.current[0];
    expect(maskSettings.type).toEqual('image');
    expect(maskSettings.index).toEqual(2);
    expect(mockVideoTrack.addProcessor).toHaveBeenCalledWith({
      maskImage: expect.any(Object),
      loadModel: mockLoadModel,
      name: 'MaskProcessor',
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

    it("should not call videoTrack.addProcessor with a param of blurProcessor if maskSettings.type is not equal to 'image'", async () => {
      mockVideoTrack.addProcessor.mockReset();
      await act(async () => {
        setMaskSettings(imgSettings);
      });
      expect(mockVideoTrack.addProcessor).not.toHaveBeenCalledWith({
        loadModel: mockLoadModel,
        name: 'MaskProcessor',
      });
      expect(window.localStorage.getItem(SELECTED_MASK_SETTINGS_KEY)).toEqual(JSON.stringify(imgSettings));
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
