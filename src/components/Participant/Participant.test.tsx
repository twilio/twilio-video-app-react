import React from 'react';
import Participant from './Participant';
import usePublications from '../../hooks/usePublications/usePublications';
import { shallow } from 'enzyme';

jest.mock('../../hooks/usePublications/usePublications', () =>
  jest.fn(() => [{ trackSid: 0 }, { trackSid: 1 }])
);

describe('the Participant component', () => {
  it('should render an array of publications', () => {
    const wrapper = shallow(
      <Participant participant={'mockParticipant' as any} />
    );
    expect(usePublications).toHaveBeenCalledWith('mockParticipant');
    expect(wrapper).toMatchSnapshot();
  });
});
