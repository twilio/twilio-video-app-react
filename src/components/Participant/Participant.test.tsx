import React from 'react';
import Participant from './Participant';
import usePublications from '../../hooks/usePublications/usePublications';
import { shallow } from 'enzyme';
import { useVideoContext } from '../../hooks/context';

jest.mock('../../hooks/usePublications/usePublications', () =>
  jest.fn(() => [{ trackSid: 0 }, { trackSid: 1 }])
);
jest.mock('../../hooks/context');

const mockUseVideoContext = useVideoContext as jest.Mock<any>;

describe('the Participant component', () => {
  it('should render an array of publications', () => {
    mockUseVideoContext.mockImplementation(() => ({ room: {} }));
    const wrapper = shallow(
      <Participant participant={'mockParticipant' as any} />
    );
    expect(usePublications).toHaveBeenCalledWith('mockParticipant');
    expect(wrapper).toMatchSnapshot();
  });

  it('should render Participants with "isLocal" set to true when the localParticipant is provided', () => {
    mockUseVideoContext.mockImplementation(() => ({
      room: { localParticipant: 'mockParticipant' },
    }));
    const wrapper = shallow(
      <Participant participant={'mockParticipant' as any} />
    );
    expect(
      wrapper
        .find('Publication')
        .first()
        .prop('isLocal')
    ).toEqual(true);
  });
});
