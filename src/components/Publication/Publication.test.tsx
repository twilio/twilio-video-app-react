import React from 'react';
import Publication from './Publication';
import { shallow } from 'enzyme';
import useTrack from '../../hooks/useTrack/useTrack';

jest.mock('../../hooks/useTrack/useTrack');
const mockUseTrack = useTrack as jest.Mock<any>;

describe('the Publication component', () => {
  describe('when track.kind is "video"', () => {
    it('should render a VideoTrack', () => {
      mockUseTrack.mockImplementation(() => ({ kind: 'video', name: 'camera-123456' }));
      const wrapper = shallow(
        <Publication isLocal publication={'mockPublication' as any} participant={'mockParticipant' as any} />
      );
      expect(useTrack).toHaveBeenCalledWith('mockPublication');
      expect(wrapper.find('VideoTrack').length).toBe(1);
    });

    it('should ignore the "isLocal" prop when track.name is not "camera"', () => {
      mockUseTrack.mockImplementation(() => ({ kind: 'video', name: 'screen-123456' }));
      const wrapper = shallow(
        <Publication isLocal publication={'mockPublication' as any} participant={'mockParticipant' as any} />
      );
      expect(useTrack).toHaveBeenCalledWith('mockPublication');
      expect(wrapper.find({ isLocal: false }).length).toBe(1);
    });

    it('should use the "isLocal" prop when track.name is "camera"', () => {
      mockUseTrack.mockImplementation(() => ({ kind: 'video', name: 'camera-123456' }));
      const wrapper = shallow(
        <Publication isLocal publication={'mockPublication' as any} participant={'mockParticipant' as any} />
      );
      expect(useTrack).toHaveBeenCalledWith('mockPublication');
      expect(wrapper.find({ isLocal: true }).length).toBe(1);
    });
  });
  describe('when track.kind is "audio"', () => {
    it('should render an AudioTrack', () => {
      mockUseTrack.mockImplementation(() => ({ kind: 'audio', name: '123456' }));
      const wrapper = shallow(
        <Publication isLocal publication={'mockPublication' as any} participant={'mockParticipant' as any} />
      );
      expect(useTrack).toHaveBeenCalledWith('mockPublication');
      expect(wrapper.find('AudioTrack').length).toBe(1);
    });

    it('should render null when disableAudio is true', () => {
      mockUseTrack.mockImplementation(() => ({ kind: 'audio' }));
      const wrapper = shallow(
        <Publication
          isLocal
          publication={'mockPublication' as any}
          participant={'mockParticipant' as any}
          disableAudio={true}
        />
      );
      expect(useTrack).toHaveBeenCalledWith('mockPublication');
      expect(wrapper.find('AudioTrack').length).toBe(0);
    });
  });

  it('should render null when there is no track', () => {
    mockUseTrack.mockImplementation(() => null);
    const wrapper = shallow(
      <Publication isLocal publication={'mockPublication' as any} participant={'mockParticipant' as any} />
    );
    expect(useTrack).toHaveBeenCalledWith('mockPublication');
    expect(wrapper.find('*').length).toBe(0);
  });
});
