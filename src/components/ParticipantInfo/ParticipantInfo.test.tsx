import React from 'react';
import ParticipantInfo from './ParticipantInfo';
import { shallow } from 'enzyme';

jest.mock(
  '../../hooks/useParticipantNetworkQualityLevel/useParticipantNetworkQualityLevel',
  () => () => 4
);

describe('the ParticipantInfo component', () => {
  it('should render correctly', () => {
    const wrapper = shallow(
      <ParticipantInfo participant={{ identity: 'mockIdentity' } as any}>
        mock children
      </ParticipantInfo>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
