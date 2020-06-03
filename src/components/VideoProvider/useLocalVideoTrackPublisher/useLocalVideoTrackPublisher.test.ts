import useLocalVideoTrackPublisher from './useLocalVideoTrackPublisher';
import { renderHook } from '@testing-library/react-hooks';

const mockVideoPublications: any = new Map();
const mockCameraPublication = { trackName: 'camera', track: 'mockCameraTrack' };
mockVideoPublications.set('mockCameraID', mockCameraPublication);
mockVideoPublications.set('mockScreenID', { trackName: 'screen', track: 'mockScreenTrack' });

describe('the useLocalVideoTrackPublisher hook', () => {
  beforeEach(jest.clearAllMocks);

  it('should unpublish', () => {
    const mockRoom: any = {
      state: 'connected',
      localParticipant: {
        emit: jest.fn(),
        publishTrack: jest.fn(),
        unpublishTrack: jest.fn(() => mockCameraPublication),
        videoTracks: mockVideoPublications,
      },
    };
    renderHook(() => useLocalVideoTrackPublisher(mockRoom, []));
    expect(mockRoom.localParticipant.unpublishTrack).toHaveBeenCalledWith('mockCameraTrack');
    expect(mockRoom.localParticipant.emit).toHaveBeenCalledWith('trackUnpublished', mockCameraPublication);
    expect(mockRoom.localParticipant.publishTrack).not.toHaveBeenCalled();
  });

  it('should publish', async () => {
    let promiseResolve: any;
    const mockRoom: any = {
      state: 'connected',
      localParticipant: {
        emit: jest.fn(),
        publishTrack: jest.fn(() => new Promise(resolve => (promiseResolve = resolve))),
        unpublishTrack: jest.fn(() => mockCameraPublication),
        videoTracks: new Map(),
      },
    };
    const mockCameraTrack: any = { name: 'camera' };
    const { result, rerender, waitForNextUpdate } = renderHook(
      ({ room, tracks }) => useLocalVideoTrackPublisher(room, tracks),
      {
        initialProps: {
          room: mockRoom,
          tracks: [mockCameraTrack],
        },
      }
    );
    expect(result.current).toBe(true);
    mockRoom.localParticipant.videoTracks.set('mockID', { trackName: 'camera', track: mockCameraTrack });
    rerender({ room: mockRoom, tracks: [mockCameraTrack] });
    promiseResolve();
    await waitForNextUpdate();
    expect(result.current).toBe(false);
    expect(mockRoom.localParticipant.publishTrack).toHaveBeenCalledTimes(1);
    expect(mockRoom.localParticipant.publishTrack).toHaveBeenCalledWith(mockCameraTrack, { priority: 'low' });
  });
});
