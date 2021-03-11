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

  afterEach(jest.clearAllMocks);

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
    wrapper.find(TextareaAutosize).simulate('change', { target: { value: ' I am a message!!! \n ' } });
    wrapper
      .find(SendMessageIcon)
      .parent()
      .simulate('click');
    expect(mockHandleSendMessage).toHaveBeenCalledWith('I am a message!!!');
  });

  it('should only send a message and reset the textarea when Enter is pressed', () => {
    const wrapper = shallow(<ChatInput conversation={{ sendMessage: mockHandleSendMessage } as any} />);
    wrapper.find(TextareaAutosize).simulate('change', { target: { value: ' I am a message!!!' } });
    wrapper.find(TextareaAutosize).simulate('keypress', { preventDefault() {}, key: 'Enter' });
    expect(mockHandleSendMessage).toHaveBeenCalledWith('I am a message!!!');
    expect(wrapper.find(TextareaAutosize).prop('value')).toBe('');
  });

  it('should not send a message when Enter is pressed on mobile', () => {
    mockUseMediaQuery.mockImplementationOnce(() => true);
    const wrapper = shallow(<ChatInput conversation={{ sendMessage: mockHandleSendMessage } as any} />);
    wrapper.find(TextareaAutosize).simulate('change', { target: { value: 'I am a message!!!' } });
    wrapper.find(TextareaAutosize).simulate('keypress', { key: 'enter' });
    expect(wrapper.find(TextareaAutosize).prop('value')).toBe('I am a message!!!');
    expect(mockHandleSendMessage).not.toHaveBeenCalled();
  });

  it('should not send a message when a user presses Enter+Shift', () => {
    const wrapper = shallow(<ChatInput conversation={{ sendMessage: mockHandleSendMessage } as any} />);
    wrapper.find(TextareaAutosize).simulate('change', { target: { value: 'I am a message!!!' } });
    wrapper.find(TextareaAutosize).simulate('keypress', { key: 'Enter', shiftKey: true });
    expect(mockHandleSendMessage).not.toHaveBeenCalled();
  });
});
