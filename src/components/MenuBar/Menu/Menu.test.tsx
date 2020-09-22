import React from 'react';
import AboutDialog from '../AboutDialog/AboutDialog';
import { Button, MenuItem } from '@material-ui/core';
import Menu from './Menu';
import MenuContainer from '@material-ui/core/Menu';
import SettingsDialog from '../SettingsDialog/SettingsDialog';
import { shallow } from 'enzyme';

describe('the Menu component', () => {
  it('should open the Menu when the Button is clicked', () => {
    const wrapper = shallow(<Menu />);
    expect(wrapper.find(MenuContainer).prop('open')).toBe(false);
    wrapper.find(Button).simulate('click');
    expect(wrapper.find(MenuContainer).prop('open')).toBe(true);
  });

  it('should open the AboutDialog when the About button is clicked', () => {
    const wrapper = shallow(<Menu />);
    expect(wrapper.find(AboutDialog).prop('open')).toBe(false);
    wrapper
      .find(MenuItem)
      .at(0)
      .simulate('click');
    expect(wrapper.find(AboutDialog).prop('open')).toBe(true);
  });

  it('should open the SettingsDialog when the Settings button is clicked', () => {
    const wrapper = shallow(<Menu />);
    expect(wrapper.find(SettingsDialog).prop('open')).toBe(false);
    wrapper
      .find(MenuItem)
      .at(1)
      .simulate('click');
    expect(wrapper.find(SettingsDialog).prop('open')).toBe(true);
  });
});
