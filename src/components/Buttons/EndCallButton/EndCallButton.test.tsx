import React from 'react';
import { shallow } from 'enzyme';

import EndCallButton from './EndCallButton';

const mockVideoContext = {
  room: {
    disconnect: jest.fn(),
  },
  removeProcessor: jest.fn(),
};

jest.mock('../../../hooks/useVideoContext/useVideoContext', () => () => mockVideoContext);

describe('End Call button', () => {
  it('should disconnect from the room when clicked', () => {
    const wrapper = shallow(<EndCallButton />);
    wrapper.simulate('click');
    expect(mockVideoContext.removeProcessor).toHaveBeenCalled();
    expect(mockVideoContext.room.disconnect).toHaveBeenCalled();
  });
});
