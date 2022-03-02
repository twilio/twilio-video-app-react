import React from 'react';
import Publication from './Publication';
import { shallow } from 'enzyme';
import useTrack from '../../hooks/useTrack/useTrack';

jest.mock('../../hooks/useTrack/useTrack');
const mockUseTrack = useTrack as jest.Mock<any>;

describe('the Publication component', () => {
  describe('when track.kind is "video"', () => {
    it('should render a VideoTrack', () => {
      mockUseTrack.mockImplementation(() => ({ kind: 'video', name: '' }));
      const wrapper = shallow(
        <Publication isLocalParticipant publication={'mockPublication' as any} participant={'mockParticipant' as any} />
      );
      expect(useTrack).toHaveBeenCalledWith('mockPublication');
      expect(wrapper.find('VideoTrack').length).toBe(1);
    });

    it('should ignore the "isLocalParticipant" prop when track.name contains "screen"', () => {
      mockUseTrack.mockImplementation(() => ({ kind: 'video', name: 'screen-123456' }));
      const wrapper = shallow(
        <Publication isLocalParticipant publication={'mockPublication' as any} participant={'mockParticipant' as any} />
      );
      expect(useTrack).toHaveBeenCalledWith('mockPublication');
      expect(wrapper.find({ isLocal: false }).length).toBe(1);
    });

    it('should use the "isLocalParticipant" prop when track.name does not contain "screen" and track.kind is "video"', () => {
      mockUseTrack.mockImplementation(() => ({ kind: 'video', name: '' }));
      const wrapper = shallow(
        <Publication isLocalParticipant publication={'mockPublication' as any} participant={'mockParticipant' as any} />
      );
      expect(useTrack).toHaveBeenCalledWith('mockPublication');
      expect(wrapper.find({ isLocal: true }).length).toBe(1);
    });
  });
});
