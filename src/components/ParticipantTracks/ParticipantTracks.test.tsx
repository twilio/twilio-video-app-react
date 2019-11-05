import React from 'react';
import ParticipantTracks from './ParticipantTracks';
import usePublications from '../../hooks/usePublications/usePublications';
import { shallow } from 'enzyme';
import { useVideoContext } from '../../hooks/context';

jest.mock('../../hooks/usePublications/usePublications', () => jest.fn(() => [{ trackSid: 0 }, { trackSid: 1 }]));
jest.mock('../../hooks/context');

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
});
