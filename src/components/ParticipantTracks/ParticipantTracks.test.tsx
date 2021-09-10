import React from 'react';
import ParticipantTracks from './ParticipantTracks';
import { shallow } from 'enzyme';
import usePublications from '../../hooks/usePublications/usePublications';

jest.mock('../../hooks/usePublications/usePublications', () =>
  jest.fn(() => [
    { trackSid: 0, kind: 'video', trackName: '' },
    { trackSid: 1, kind: 'audio', trackName: '' },
  ])
);

const mockUsePublications = usePublications as jest.Mock<any>;

describe('the ParticipantTracks component', () => {
  it('should render an array of publications', () => {
    const wrapper = shallow(<ParticipantTracks participant={'mockParticipant' as any} />);
    expect(usePublications).toHaveBeenCalledWith('mockParticipant');
    expect(wrapper).toMatchSnapshot();
  });

  it('should filter out any screen share publications', () => {
    mockUsePublications.mockImplementation(() => [
      { trackName: 'screen', trackSid: 0, kind: 'video' },
      { trackName: '', trackSid: 1, kind: 'video' },
    ]);
    const wrapper = shallow(<ParticipantTracks participant={'mockParticipant' as any} />);
    expect(wrapper.find('Publication').length).toBe(1);
    expect(
      wrapper
        .find('Publication')
        .at(0)
        .prop('publication')
    ).toEqual({ trackName: '', trackSid: 1, kind: 'video' });
  });

  describe('with enableScreenShare prop', () => {
    it('should filter out camera publications when a screen share publication is present', () => {
      mockUsePublications.mockImplementation(() => [
        { trackName: 'screen', trackSid: 0, kind: 'video' },
        { trackName: '', trackSid: 1, kind: 'video' },
      ]);
      const wrapper = shallow(<ParticipantTracks participant={'mockParticipant' as any} enableScreenShare />);
      expect(wrapper.find('Publication').length).toBe(1);
      expect(
        wrapper
          .find('Publication')
          .at(0)
          .prop('publication')
      ).toEqual({ trackName: 'screen', trackSid: 0, kind: 'video' });
    });

    it('should render camera publications when a screen share publication is absent', () => {
      mockUsePublications.mockImplementation(() => [{ trackName: '', trackSid: 1, kind: 'video' }]);
      const wrapper = shallow(<ParticipantTracks participant={'mockParticipant' as any} enableScreenShare />);
      expect(wrapper.find('Publication').length).toBe(1);
      expect(
        wrapper
          .find('Publication')
          .at(0)
          .prop('publication')
      ).toEqual({ trackName: '', trackSid: 1, kind: 'video' });
    });
  });
});
