import React from 'react';
import UnsupportedBrowserWarning from './UnsupportedBrowserWarning';
import Video from 'twilio-video';
import { shallow } from 'enzyme';

describe('the UnsupportedBrowserWarning component', () => {
  it('should render correctly when isSupported is false and isSecureContext is true', () => {
    // @ts-ignore
    Video.isSupported = false;
    // @ts-ignore
    window.isSecureContext = true;
    const wrapper = shallow(
      <UnsupportedBrowserWarning>
        <span>Is supported</span>
      </UnsupportedBrowserWarning>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when isSupported is false and isSecureContext is true', () => {
    // @ts-ignore
    Video.isSupported = false;
    // @ts-ignore
    window.isSecureContext = false;
    const wrapper = shallow(
      <UnsupportedBrowserWarning>
        <span>Is supported</span>
      </UnsupportedBrowserWarning>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render children when browser is supported', () => {
    // @ts-ignore
    Video.isSupported = true;
    // @ts-ignore
    window.isSecureContext = true;
    const wrapper = shallow(
      <UnsupportedBrowserWarning>
        <span>Is supported</span>
      </UnsupportedBrowserWarning>
    );
    expect(wrapper.text()).toBe('Is supported');
  });
});
