import React from 'react';
import { shallow } from 'enzyme';
import { Button } from '@material-ui/core';

import ChatIcon from '../../../icons/ChatIcon';
import ToggleChatButton from './ToggleChatButton';

import useChatContext from '../../../hooks/useChatContext/useChatContext';

jest.mock('../../../hooks/useChatContext/useChatContext');
const mockUseChatContext = useChatContext as jest.Mock<any>;

const mockToggleChatWindow = jest.fn();
mockUseChatContext.mockImplementation(() => ({ setIsChatWindowOpen: mockToggleChatWindow }));

describe('the ToggleChatButton component', () => {
  it('should render correctly when chat is enabled', () => {
    const wrapper = shallow(<ToggleChatButton />);
    expect(wrapper.prop('startIcon')).toEqual(<ChatIcon />);
    expect(wrapper.text()).toBe('Chat');
  });

  it('should call the correct toggle function when clicked', () => {
    const wrapper = shallow(<ToggleChatButton />);
    wrapper.find(Button).simulate('click');
    expect(mockToggleChatWindow).toHaveBeenCalled();
  });
});
