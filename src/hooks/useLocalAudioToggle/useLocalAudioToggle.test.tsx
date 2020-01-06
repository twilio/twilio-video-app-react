import { renderHook } from '@testing-library/react-hooks';
import useLocalAudioToggle from './useLocalAudioToggle';
import { useVideoContext } from '../context';
import { EventEmitter } from 'events';
import { LocalParticipant } from 'twilio-video';

jest.mock('../context');
const mockUseVideoContext = useVideoContext as jest.Mock<any>;

describe('the useLocalAudioToggle hook', () => {
  it('should return true when a localAudioTrack exists', () => {
    mockUseVideoContext.mockImplementation(() => ({
      localTracks: [
        {
          name: 'microphone',
        },
      ],
      room: { localParticipant: {} },
    }));

    const { result } = renderHook(useLocalAudioToggle);
    expect(result.current).toEqual([true, expect.any(Function)]);
  });

  it('should return false when a localAudioTrack does not exist', () => {
    mockUseVideoContext.mockImplementation(() => ({
      localTracks: [
        {
          name: 'camera',
        },
      ],
      room: { localParticipant: {} },
    }));

    const { result } = renderHook(useLocalAudioToggle);
    expect(result.current).toEqual([false, expect.any(Function)]);
  });

  describe('toggleAudioEnabled function', () => {
    it('should call track.stop when a localAudioTrack exists', () => {
      const mockLocalTrack = {
        name: 'microphone',
        stop: jest.fn(),
      };

      mockUseVideoContext.mockImplementation(() => ({
        localTracks: [mockLocalTrack],
        room: { localParticipant: null },
      }));

      const { result } = renderHook(useLocalAudioToggle);
      result.current[1]();
      expect(mockLocalTrack.stop).toHaveBeenCalled();
    });

    it('should call localParticipant.unpublishTrack when a localAudioTrack and localParticipant exists', () => {
      const mockLocalTrack = {
        name: 'microphone',
        stop: jest.fn(),
      };

      const mockLocalParticipant = new EventEmitter() as LocalParticipant;
      mockLocalParticipant.unpublishTrack = jest.fn();

      mockUseVideoContext.mockImplementation(() => ({
        localTracks: [mockLocalTrack],
        room: { localParticipant: mockLocalParticipant },
      }));

      const { result } = renderHook(useLocalAudioToggle);
      result.current[1]();
      expect(mockLocalParticipant.unpublishTrack).toHaveBeenCalledWith(mockLocalTrack);
    });

    it('should call getLocalAudioTrack when a localAudioTrack does not exist', () => {
      const mockGetLocalAudioTrack = jest.fn(() => Promise.resolve());
      mockUseVideoContext.mockImplementation(() => ({
        localTracks: [],
        getLocalAudioTrack: mockGetLocalAudioTrack,
        room: {},
      }));

      const { result } = renderHook(useLocalAudioToggle);
      result.current[1]();
      expect(mockGetLocalAudioTrack).toHaveBeenCalled();
    });

    it('should call mockLocalParticipant.publishTrack when a localAudioTrack does not exist and localParticipant does exist', done => {
      const mockGetLocalAudioTrack = jest.fn(() => Promise.resolve('mockTrack'));

      const mockLocalParticipant = new EventEmitter() as LocalParticipant;
      mockLocalParticipant.publishTrack = jest.fn();

      mockUseVideoContext.mockImplementation(() => ({
        localTracks: [],
        getLocalAudioTrack: mockGetLocalAudioTrack,
        room: { localParticipant: mockLocalParticipant },
      }));

      const { result } = renderHook(useLocalAudioToggle);
      result.current[1]();
      setImmediate(() => {
        expect(mockLocalParticipant.publishTrack).toHaveBeenCalledWith('mockTrack');
        done();
      });
    });
  });
});
