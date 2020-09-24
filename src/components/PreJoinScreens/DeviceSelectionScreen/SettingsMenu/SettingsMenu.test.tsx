import React from 'react';
import AboutDialog from '../../../MenuBar/AboutDialog/AboutDialog';
import { Button, MenuItem } from '@material-ui/core';
import ConnectionOptions from '../../../MenuBar/ConnectionOptions/ConnectionOptions';
import DeviceSelector from '../../../MenuBar/DeviceSelector/DeviceSelector';
import Menu from './SettingsMenu';
import MenuContainer from '@material-ui/core/Menu';
import { shallow } from 'enzyme';
import useMediaQuery from '@material-ui/core/useMediaQuery';

jest.mock('@material-ui/core/useMediaQuery');
const mockUseMediaQuery = useMediaQuery as jest.Mock<boolean>;

describe('the SettingsMenu component', () => {
  describe('on desktop devices', () => {
    beforeAll(() => {
      mockUseMediaQuery.mockImplementation(() => false);
    });

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

    it('should open the DeviceSelector when the Settings button is clicked', () => {
      const wrapper = shallow(<Menu />);
      expect(wrapper.find(DeviceSelector).prop('open')).toBe(false);
      wrapper
        .find(MenuItem)
        .at(1)
        .simulate('click');
      expect(wrapper.find(DeviceSelector).prop('open')).toBe(true);
    });

    it('should open the ConnectionOptions dialog when the Settings button is clicked', () => {
      const wrapper = shallow(<Menu />);
      expect(wrapper.find(ConnectionOptions).prop('open')).toBe(false);
      wrapper
        .find(MenuItem)
        .at(2)
        .simulate('click');
      expect(wrapper.find(ConnectionOptions).prop('open')).toBe(true);
    });

    it('should render the correct button', () => {
      const wrapper = shallow(<Menu />);
      expect(wrapper.find(Button).text()).toBe('Settings');
    });
  });

  describe('on mobile devices', () => {
    beforeAll(() => {
      mockUseMediaQuery.mockImplementation(() => true);
    });

    it('should render the correct icon', () => {
      const wrapper = shallow(<Menu />);
      expect(wrapper.find(Button).text()).toBe('More');
    });
  });
});
