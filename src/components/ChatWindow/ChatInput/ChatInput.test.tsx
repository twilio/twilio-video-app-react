import React from 'react';
import { shallow } from 'enzyme';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import ChatInput from '../ChatInput/ChatInput';
import SendMessageIcon from '../../../icons/SendMessageIcon';

jest.mock('@material-ui/core/useMediaQuery');

const mockUseMediaQuery = useMediaQuery as jest.Mock<boolean>;
const mockHandleSendMessage = jest.fn();

describe('the ChatInput component', () => {
  beforeAll(() => {
    mockUseMediaQuery.mockImplementation(() => false);
  });

  it('should activate the send message button when user types a valid message', () => {
    const wrapper = shallow(<ChatInput conversation={{ sendMessage: mockHandleSendMessage } as any} />);
    expect(
      wrapper
        .find(SendMessageIcon)
        .parent()
        .prop('className')
    ).not.toContain('activeSendButton');
    wrapper.find(TextareaAutosize).simulate('change', { target: { value: 'I am a message!!!' } });
    expect(
      wrapper
        .find(SendMessageIcon)
        .parent()
        .prop('className')
    ).toContain('activeSendButton');
  });

  it('should not activate the send message button when message only contains whitespace', () => {
    const wrapper = shallow(<ChatInput conversation={{ sendMessage: mockHandleSendMessage } as any} />);
    wrapper.find(TextareaAutosize).simulate('change', { target: { value: '         ' } });
    expect(
      wrapper
        .find(SendMessageIcon)
        .parent()
        .prop('className')
    ).not.toContain('activeSendButton');
  });

  it('should call the correct function when send message button is clicked', () => {
    const wrapper = shallow(<ChatInput conversation={{ sendMessage: mockHandleSendMessage } as any} />);
    wrapper.find(TextareaAutosize).simulate('change', { target: { value: 'I am a message!!!' } });
    wrapper
      .find(SendMessageIcon)
      .parent()
      .simulate('click');
    expect(mockHandleSendMessage).toHaveBeenCalled();
  });
});
