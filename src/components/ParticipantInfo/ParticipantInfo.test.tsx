import React from 'react';
import { shallow } from 'enzyme';
import ParticipantInfo from './ParticipantInfo';

jest.mock(
  '../../hooks/useParticipantNetworkQualityLevel/useParticipantNewtorkQualityLevel',
  () => () => 4
);

describe('the ParticipantInfo component', () => {
  it('should render correctly', () => {
    const wrapper = shallow(
      <ParticipantInfo participant={{ identity: 'test' } as any}>
        Children
      </ParticipantInfo>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
