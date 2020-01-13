import { act, renderHook } from '@testing-library/react-hooks';
import EventEmitter from 'events';
import { mockRoom } from '../../../__mocks__/twilio-video';
import useRoom from './useRoom';
import Video, { LocalTrack } from 'twilio-video';

const mockVideoConnect = Video.connect as jest.Mock<any>;

describe('the useRoom hook', () => {
  beforeEach(jest.clearAllMocks);
  afterEach(() => mockRoom.removeAllListeners());

  it('should return an empty room when no token is provided', () => {
    const { result } = renderHook(() => useRoom([], () => {}, '', {}));
    expect(result.current.room).toEqual(new EventEmitter());
  });

  it('should set isConnecting to true while connecting to the room ', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useRoom([], () => {}, 'token', {}));
    expect(result.current.isConnecting).toBe(true);
    expect(Video.connect).toHaveBeenCalledTimes(1);
    await waitForNextUpdate();
    expect(result.current.room.disconnect).not.toHaveBeenCalled();
    expect(result.current.isConnecting).toBe(false);
  });

  it('should publish video tracks with low priority', async () => {
    const { waitForNextUpdate } = renderHook(() =>
      useRoom([{ kind: 'video' } as LocalTrack, { kind: 'audio' } as LocalTrack], () => {}, 'token', {})
    );
    await waitForNextUpdate();
    expect(mockRoom.localParticipant.publishTrack).toHaveBeenCalledWith({ kind: 'video' }, { priority: 'low' });
    expect(mockRoom.localParticipant.publishTrack).toHaveBeenCalledWith({ kind: 'audio' }, { priority: 'standard' });
  });

  it('should publish video tracks that are supplied in a rerender', async () => {
    const { rerender, waitForNextUpdate } = renderHook(props => useRoom(props.tracks, () => {}, 'token', {}), {
      initialProps: { tracks: [] as LocalTrack[] },
    });
    rerender({ tracks: [{ kind: 'video' } as LocalTrack] });
    await waitForNextUpdate();
    expect(mockRoom.localParticipant.publishTrack).toHaveBeenCalledWith({ kind: 'video' }, { priority: 'low' });
  });

  it('should return a room when a token is provided', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useRoom([], () => {}, 'token', {}));
    await waitForNextUpdate();
    expect(result.current.room.state).toEqual('connected');
  });

  it('should add a listener for the "beforeUnload" event when the component is mounted', async () => {
    jest.spyOn(window, 'addEventListener');
    const { waitForNextUpdate } = renderHook(() => useRoom([], () => {}, 'token', {}));
    await waitForNextUpdate();
    expect(window.addEventListener).toHaveBeenCalledWith('beforeunload', expect.any(Function));
  });

  it('should remove the listener for the "beforeUnload" event when the component is unmounted', async () => {
    jest.spyOn(window, 'removeEventListener');
    const { waitForNextUpdate, rerender } = renderHook(
      ({ localTracks, token, options }) => useRoom(localTracks, () => {}, token, options),
      {
        initialProps: {
          localTracks: [],
          token: 'token',
          options: {},
        },
      }
    );
    await waitForNextUpdate();
    rerender({
      localTracks: [],
      token: '',
      options: {},
    });
    expect(window.removeEventListener).toHaveBeenCalledWith('beforeunload', expect.any(Function));
  });

  it('should not call Video.connect if already connected to a room', async () => {
    const { result, waitForNextUpdate, rerender } = renderHook(() => useRoom([], () => {}, 'token', {}));
    await waitForNextUpdate();
    expect(result.current.room.state).toBe('connected');
    rerender();
    expect(Video.connect).toHaveBeenCalledTimes(1);
  });

  it('should call onError when there is an error', done => {
    const mockOnError = jest.fn();
    mockVideoConnect.mockImplementationOnce(() => Promise.reject('mockError'));
    renderHook(() => useRoom([], mockOnError, 'token', {}));
    setImmediate(() => {
      expect(mockOnError).toHaveBeenCalledWith('mockError');
      done();
    });
  });

  it('should reset the room object on disconnect', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useRoom([], () => {}, 'token', {}));
    await waitForNextUpdate();
    expect(result.current.room.state).toBe('connected');
    await act(async () => {
      result.current.room.emit('disconnected');
      await waitForNextUpdate();
      expect(result.current.room.state).toBe(undefined);
    });
  });
});
