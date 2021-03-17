import React from 'react';
import { shallow } from 'enzyme';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import ChatInput from '../ChatInput/ChatInput';
import SendMessageIcon from '../../../icons/SendMessageIcon';
import { CircularProgress } from '@material-ui/core';
import FileAttachmentIcon from '../../../icons/FileAttachmentIcon';
import Snackbar from '../../Snackbar/Snackbar';

jest.mock('@material-ui/core/useMediaQuery');

const mockUseMediaQuery = useMediaQuery as jest.Mock<boolean>;
const mockHandleSendMessage = jest.fn<any, (string | FormData)[]>(() => Promise.resolve());

describe('the ChatInput component', () => {
  beforeAll(() => {
    mockUseMediaQuery.mockImplementation(() => false);
  });

  afterEach(jest.clearAllMocks);

  it('should enable the send message button when user types a valid message', () => {
    const wrapper = shallow(<ChatInput conversation={{ sendMessage: mockHandleSendMessage } as any} />);
    expect(
      wrapper
        .find(SendMessageIcon)
        .parent()
        .prop('disabled')
    ).toBe(true);
    wrapper.find(TextareaAutosize).simulate('change', { target: { value: 'I am a message!!!' } });
    expect(
      wrapper
        .find(SendMessageIcon)
        .parent()
        .prop('disabled')
    ).toBe(false);
  });

  it('should disable the send message button when message only contains whitespace', () => {
    const wrapper = shallow(<ChatInput conversation={{ sendMessage: mockHandleSendMessage } as any} />);
    wrapper.find(TextareaAutosize).simulate('change', { target: { value: '         ' } });
    expect(
      wrapper
        .find(SendMessageIcon)
        .parent()
        .prop('disabled')
    ).toBe(true);
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

  it('should send a media message when a user selects a file', () => {
    const wrapper = shallow(<ChatInput conversation={{ sendMessage: mockHandleSendMessage } as any} />);
    wrapper.find('input[type="file"]').simulate('change', { target: { files: ['mockFile'] } });
    var formData = mockHandleSendMessage.mock.calls[0][0] as FormData;
    expect(formData).toEqual(expect.any(FormData));
    expect(formData.get('userfile')).toBe('mockFile');
  });

  it('should not send a media message when the "change" event is fired with no files', () => {
    const wrapper = shallow(<ChatInput conversation={{ sendMessage: mockHandleSendMessage } as any} />);
    wrapper.find('input[type="file"]').simulate('change', { target: { files: [] } });
    expect(mockHandleSendMessage).not.toHaveBeenCalled();
  });

  it('should disable the file input button and display a loading spinner while sending a file', done => {
    const wrapper = shallow(<ChatInput conversation={{ sendMessage: mockHandleSendMessage } as any} />);

    expect(wrapper.find(CircularProgress).exists()).toBe(false);
    expect(
      wrapper
        .find(FileAttachmentIcon)
        .parent()
        .prop('disabled')
    ).toBe(false);

    wrapper.find('input[type="file"]').simulate('change', { target: { files: ['mockFile'] } });

    expect(wrapper.find(CircularProgress).exists()).toBe(true);
    expect(
      wrapper
        .find(FileAttachmentIcon)
        .parent()
        .prop('disabled')
    ).toBe(true);

    setImmediate(() => {
      expect(wrapper.find(CircularProgress).exists()).toBe(false);
      expect(
        wrapper
          .find(FileAttachmentIcon)
          .parent()
          .prop('disabled')
      ).toBe(false);
      done();
    });
  });

  it('should display an error when there is a problem sending a file', done => {
    mockHandleSendMessage.mockImplementationOnce(() => Promise.reject({}));
    const wrapper = shallow(<ChatInput conversation={{ sendMessage: mockHandleSendMessage } as any} />);

    expect(wrapper.find(Snackbar).prop('open')).toBe(false);
    wrapper.find('input[type="file"]').simulate('change', { target: { files: ['mockFile'] } });

    setImmediate(() => {
      expect(wrapper.find(Snackbar).prop('open')).toBe(true);
      expect(wrapper.find(Snackbar).prop('message')).toBe('There was a problem uploading the file. Please try again.');
      done();
    });
  });

  it('should display a "file is too large" error when there is a 413 error code', done => {
    mockHandleSendMessage.mockImplementationOnce(() => Promise.reject({ code: 413 }));
    const wrapper = shallow(<ChatInput conversation={{ sendMessage: mockHandleSendMessage } as any} />);

    expect(wrapper.find(Snackbar).prop('open')).toBe(false);
    wrapper.find('input[type="file"]').simulate('change', { target: { files: ['mockFile'] } });

    setImmediate(() => {
      expect(wrapper.find(Snackbar).prop('open')).toBe(true);
      expect(wrapper.find(Snackbar).prop('message')).toBe(
        'File size is too large. Maxiumim size is 150MB. Please try again.'
      );
      done();
    });
  });
});
