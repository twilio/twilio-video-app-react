import React from 'react';
import { shallow } from 'enzyme';

import EndCallButton from './EndCallButton';

const mockSetToken = jest.fn();
const mockRoom: any = { disconnect: jest.fn() };
jest.mock('../../../state', () => ({ useAppState: () => ({ setToken: mockSetToken }) }));
jest.mock('../../../hooks/useVideoContext/useVideoContext', () => () => ({ room: mockRoom }));

describe('End Call button', () => {
  it('should delete the token from appState and disconnect from the room when clicked', () => {
    const wrapper = shallow(<EndCallButton />);
    wrapper.simulate('click');
    expect(mockSetToken).toHaveBeenCalledWith('');
    expect(mockRoom.disconnect).toHaveBeenCalled();
  });
});
