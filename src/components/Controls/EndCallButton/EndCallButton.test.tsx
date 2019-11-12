import React from 'react';
import { receiveToken } from '../../../store/main/main';
import { shallow } from 'enzyme';

import EndCallButton from './EndCallButton';

jest.mock('../../../store/main/main');
jest.mock('react-redux', () => ({ useDispatch: () => jest.fn() }));

describe('End Call button', () => {
  it('should delete the token from redux when clicked', () => {
    const wrapper = shallow(<EndCallButton />);
    wrapper.simulate('click');
    expect(receiveToken).toHaveBeenCalledWith('');
  });
});
