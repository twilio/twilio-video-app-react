import React from 'react';
import { shallow } from 'enzyme';

import CloseChatWindowButton from './CloseChatWindowButton';
import CloseChatWindowIcon from '../../../icons/CloseChatWindowIcon';

import useChatContext from '../../../hooks/useChatContext/useChatContext';

jest.mock('../../../hooks/useChatContext/useChatContext');

const mockUseChatContext = useChatContext as jest.Mock<any>;

const mockToggleChatWindow = jest.fn();
mockUseChatContext.mockImplementation(() => ({ setIsChatWindowOpen: mockToggleChatWindow }));

describe('the CloseChatWindowButton component', () => {
  it('should render correctly when chat window is open', () => {
    const wrapper = shallow(<CloseChatWindowButton />);
    expect(wrapper.containsMatchingElement(<CloseChatWindowIcon />)).toEqual(true);
  });

  it('should close the chat window when clicked on', () => {
    const wrapper = shallow(<CloseChatWindowButton />);
    wrapper.simulate('click');
    expect(mockToggleChatWindow).toHaveBeenCalled();
  });
});
