import React from 'react';
import { receiveToken } from '../../../store/main/main';
import { shallow } from 'enzyme';

import EndCallButton from './EndCallButton';

const mockRoom: any = { disconnect: jest.fn() };
jest.mock('../../../store/main/main');
jest.mock('react-redux', () => ({ useDispatch: () => jest.fn() }));
jest.mock('../../../hooks/context', () => ({ useVideoContext: () => ({ room: mockRoom }) }));

describe('End Call button', () => {
  it('should delete the token from redux and disconnect from the room when clicked', () => {
    const wrapper = shallow(<EndCallButton />);
    wrapper.simulate('click');
    expect(receiveToken).toHaveBeenCalledWith('');
    expect(mockRoom.disconnect).toHaveBeenCalled();
  });
});
