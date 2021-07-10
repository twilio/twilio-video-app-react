import { act, renderHook } from '@testing-library/react-hooks';
import { EventEmitter } from 'events';
import { Room } from 'twilio-video';
import useBackgroundSettings, { BackgroundSettings } from './useBackgroundSettings';

const defaultSettings = {
  type: 'none',
  index: 0,
};

const blurSettings = {
  type: 'blur',
};

const mockLoadModel = jest.fn();
const mockRemoveProcessor = jest.fn();
const mockAddProcessor = jest.fn();

jest.mock('@twilio/video-processors', () => {
  return {
    GaussianBlurBackgroundProcessor: jest.fn().mockImplementation(() => {
      return {
        loadModel: mockLoadModel,
        //added attribute for testing purposes
        name: 'GaussianBlurBackgroundProcessor',
      };
    }),
  };
});

describe('The useBackgroundSettings hook ', () => {
  let mockRoom: any;
  beforeEach(() => {
    mockRoom = new EventEmitter() as Room;
    mockRemoveProcessor.mockImplementation(() => {
      mockRoom.localParticipant.videoTracks[0].track.processor = '';
    });
    mockAddProcessor.mockImplementation(processorName => {
      mockRoom.localParticipant.videoTracks[0].track.processor = processorName.name;
    });
    mockRoom.localParticipant = {
      videoTracks: [
        {
          track: {
            processor: '',
            removeProcessor: mockRemoveProcessor,
            addProcessor: mockAddProcessor,
          },
        },
      ],
    };
  });

  it('should return the backgroundsettings and update function.', () => {
    const { result } = renderHook(() => useBackgroundSettings(mockRoom));
    expect(result.current).toEqual([defaultSettings, expect.any(Function)]);
  });

  it('should set the background settings correctly and remove the video processor when "none" is selected', async () => {
    const { result } = renderHook(() => useBackgroundSettings(mockRoom));
    // set video processor to non-null value
    await act(async () => {
      result.current[1](blurSettings as BackgroundSettings);
    });
    // set video processor to none
    await act(async () => {
      result.current[1](defaultSettings as BackgroundSettings);
    });
    expect(mockRemoveProcessor).toHaveBeenCalled();
    expect(result.current[0].type).toEqual('none');
  });

  it('should set the background settings correctly and set the video processor when "blur" is selected', async () => {
    const { result } = renderHook(() => useBackgroundSettings(mockRoom));
    await act(async () => {
      result.current[1](blurSettings as BackgroundSettings);
    });
    expect(result.current[0].type).toEqual('blur');
    expect(mockAddProcessor).toHaveBeenCalled();
    expect(mockRoom.localParticipant.videoTracks[0].track.processor).toEqual('GaussianBlurBackgroundProcessor');
  });

  it('should set the background settings correctly and set the video processor when "image" is selected', () => {
    // TODO add test after implementing virtual background feature/logic
  });
});
