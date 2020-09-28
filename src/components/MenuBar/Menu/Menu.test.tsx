import React from 'react';
import AboutDialog from '../../AboutDialog/AboutDialog';
import { Button, MenuItem } from '@material-ui/core';
import DeviceSelectionDialog from '../../DeviceSelectionDialog/DeviceSelectionDialog';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Menu from './Menu';
import MenuContainer from '@material-ui/core/Menu';
import MoreIcon from '@material-ui/icons/MoreVert';
import { shallow } from 'enzyme';
import useMediaQuery from '@material-ui/core/useMediaQuery';

jest.mock('@material-ui/core/useMediaQuery');
const mockUseMediaQuery = useMediaQuery as jest.Mock<boolean>;

describe('the Menu component', () => {
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

    it('should render the correct icon', () => {
      const wrapper = shallow(<Menu />);
      expect(wrapper.find(ExpandMoreIcon).exists()).toBe(true);
      expect(wrapper.find(MoreIcon).exists()).toBe(false);
    });
  });

  describe('on mobile devices', () => {
    beforeAll(() => {
      mockUseMediaQuery.mockImplementation(() => true);
    });

    it('should render the correct icon', () => {
      const wrapper = shallow(<Menu />);
      expect(wrapper.find(ExpandMoreIcon).exists()).toBe(false);
      expect(wrapper.find(MoreIcon).exists()).toBe(true);
    });
  });
});
