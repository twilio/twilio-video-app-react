import React from 'react';
import { shallow } from 'enzyme';

import CloseIcon from '../../../icons/CloseIcon';
import ChatWindowHeader from './ChatWindowHeader';
import useChatContext from '../../../hooks/useChatContext/useChatContext';

jest.mock('../../../hooks/useChatContext/useChatContext');

const mockUseChatContext = useChatContext as jest.Mock<any>;

const mockToggleChatWindow = jest.fn();
mockUseChatContext.mockImplementation(() => ({ setIsChatWindowOpen: mockToggleChatWindow }));

describe('the CloseChatWindowHeader component', () => {
  it('should close the chat window when "X" is clicked on', () => {
    const wrapper = shallow(<ChatWindowHeader />);
    wrapper
      .find(CloseIcon)
      .parent()
      .simulate('click');
    expect(mockToggleChatWindow).toHaveBeenCalledWith(false);
  });
});
