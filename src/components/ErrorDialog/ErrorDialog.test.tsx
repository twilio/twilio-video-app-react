import React from 'react';
import { shallow } from 'enzyme';
import { TwilioError } from 'twilio-video';

import Button from '@material-ui/core/Button';
import { Dialog } from '@material-ui/core';
import DialogContentText from '@material-ui/core/DialogContentText';

import ErrorDialog from './ErrorDialog';

describe('the ErrorDialog component', () => {
  const message = 'Fake Error message';
  const code = 45345;

  it('should be closed if no error is passed', () => {
    const wrapper = shallow(<ErrorDialog dismissError={() => {}} error={null} />);
    expect(wrapper.find(Dialog).prop('open')).toEqual(false);
  });

  it('should be open if an error is passed', () => {
    const error = {} as TwilioError;
    const wrapper = shallow(<ErrorDialog dismissError={() => {}} error={error} />);
    expect(wrapper.find(Dialog).prop('open')).toEqual(true);
  });

  it('should display error message but not error code is the later does not exist', () => {
    const error = { message } as TwilioError;
    const wrapper = shallow(<ErrorDialog dismissError={() => {}} error={error} />);
    expect(wrapper.find(DialogContentText).text()).toBe(message);
    expect(wrapper.find('code').exists()).toBe(false);
  });

  it('should display error message and error code when both are given', () => {
    const error = { message, code } as TwilioError;
    const wrapper = shallow(<ErrorDialog dismissError={() => {}} error={error} />);
    expect(wrapper.find(DialogContentText).text()).toBe(message);
    expect(wrapper.find('code').exists()).toBe(true);
    expect(wrapper.find('code').text()).toBe(`Error Code: ${code}`);
  });

  it('should invoke dismissError prop when the user clicks on OK button', () => {
    const error = { message, code } as TwilioError;
    const dismissError = jest.fn();
    const wrapper = shallow(<ErrorDialog dismissError={dismissError} error={error} />);
    wrapper.find(Button).simulate('click');
    expect(dismissError).toHaveBeenCalled();
  });
});
