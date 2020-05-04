import React from 'react';
import ParticipantTracks from './ParticipantTracks';
import usePublications from '../../hooks/usePublications/usePublications';
import { shallow } from 'enzyme';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';

jest.mock('../../hooks/usePublications/usePublications', () =>
  jest.fn(() => [
    { trackSid: 0, kind: 'video', trackName: '' },
    { trackSid: 1, kind: 'audio', trackName: '' },
  ])
);
jest.mock('../../hooks/useVideoContext/useVideoContext');

const mockUsePublications = usePublications as jest.Mock<any>;
const mockUseVideoContext = useVideoContext as jest.Mock<any>;

describe('the ParticipantTracks component', () => {
  it('should render an array of publications', () => {
    mockUseVideoContext.mockImplementation(() => ({ room: {} }));
    const wrapper = shallow(<ParticipantTracks participant={'mockParticipant' as any} />);
    expect(usePublications).toHaveBeenCalledWith('mockParticipant');
    expect(wrapper).toMatchSnapshot();
  });

  it('should render publications with "isLocal" set to true when the localParticipant is provided', () => {
    mockUseVideoContext.mockImplementation(() => ({
      room: { localParticipant: 'mockParticipant' },
    }));
    const wrapper = shallow(<ParticipantTracks participant={'mockParticipant' as any} />);
    expect(
      wrapper
        .find('Publication')
        .first()
        .prop('isLocal')
    ).toEqual(true);
  });

  it('should filter out any screen share publications', () => {
    mockUseVideoContext.mockImplementation(() => ({ room: {} }));
    mockUsePublications.mockImplementation(() => [
      { trackName: 'screen', trackSid: 0, kind: 'video' },
      { trackName: 'camera-123456', trackSid: 1, kind: 'video' },
    ]);
    const wrapper = shallow(<ParticipantTracks participant={'mockParticipant' as any} />);
    expect(wrapper.find('Publication').length).toBe(1);
    expect(
      wrapper
        .find('Publication')
        .at(0)
        .prop('publication')
    ).toEqual({ trackName: 'camera-123456', trackSid: 1, kind: 'video' });
  });

  describe('with enableScreenShare prop', () => {
    it('should filter out camera publications when a screen share publication is present', () => {
      mockUseVideoContext.mockImplementation(() => ({ room: {} }));
      mockUsePublications.mockImplementation(() => [
        { trackName: 'screen', trackSid: 0, kind: 'video' },
        { trackName: 'camera-123456', trackSid: 1, kind: 'video' },
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
      mockUseVideoContext.mockImplementation(() => ({ room: {} }));
      mockUsePublications.mockImplementation(() => [{ trackName: 'camera-123456', trackSid: 1, kind: 'video' }]);
      const wrapper = shallow(<ParticipantTracks participant={'mockParticipant' as any} enableScreenShare />);
      expect(wrapper.find('Publication').length).toBe(1);
      expect(
        wrapper
          .find('Publication')
          .at(0)
          .prop('publication')
      ).toEqual({ trackName: 'camera-123456', trackSid: 1, kind: 'video' });
    });
  });
});
