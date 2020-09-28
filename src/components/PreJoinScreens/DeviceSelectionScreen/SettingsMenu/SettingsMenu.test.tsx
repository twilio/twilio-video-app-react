import React from 'react';
import AboutDialog from '../../../AboutDialog/AboutDialog';
import { Button, MenuItem } from '@material-ui/core';
import ConnectionOptionsDialog from '../../../ConnectionOptionsDialog/ConnectionOptionsDialog';
import DeviceSelectionDialog from '../../../DeviceSelectionDialog/DeviceSelectionDialog';
import Menu from './SettingsMenu';
import MenuContainer from '@material-ui/core/Menu';
import { shallow } from 'enzyme';
import { useAppState } from '../../../../state';
import useMediaQuery from '@material-ui/core/useMediaQuery';

jest.mock('@material-ui/core/useMediaQuery');
const mockUseMediaQuery = useMediaQuery as jest.Mock<boolean>;

jest.mock('../../../../state');
const mockUseAppState = useAppState as jest.Mock<any>;
mockUseAppState.mockImplementation(() => ({ roomType: 'group' }));

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

    it('should open the DeviceSelectionDialog when the Settings button is clicked', () => {
      const wrapper = shallow(<Menu />);
      expect(wrapper.find(DeviceSelectionDialog).prop('open')).toBe(false);
      wrapper
        .find(MenuItem)
        .at(1)
        .simulate('click');
      expect(wrapper.find(DeviceSelectionDialog).prop('open')).toBe(true);
    });

    it('should open the ConnectionOptionsDialog when the Settings button is clicked', () => {
      const wrapper = shallow(<Menu />);
      expect(wrapper.find(ConnectionOptionsDialog).prop('open')).toBe(false);
      wrapper
        .find(MenuItem)
        .at(2)
        .simulate('click');
      expect(wrapper.find(ConnectionOptionsDialog).prop('open')).toBe(true);
    });

    it('should render the correct button', () => {
      const wrapper = shallow(<Menu />);
      expect(wrapper.find(Button).text()).toBe('Settings');
    });

    it('should render the "Connection Settings" button when the roomType is "group"', () => {
      const wrapper = shallow(<Menu />);
      expect(wrapper.find({ children: 'Connection Settings' }).exists()).toBe(true);
    });

    it('should not render the "Connection Settings" button when the roomType is "go"', () => {
      mockUseAppState.mockImplementationOnce(() => ({ roomType: 'go' }));
      const wrapper = shallow(<Menu />);
      expect(wrapper.find({ children: 'Connection Settings' }).exists()).toBe(false);
    });

    it('should not render the "Connection Settings" button when the roomType is "peer-to-peer"', () => {
      mockUseAppState.mockImplementationOnce(() => ({ roomType: 'peer-to-peer' }));
      const wrapper = shallow(<Menu />);
      expect(wrapper.find({ children: 'Connection Settings' }).exists()).toBe(false);
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
