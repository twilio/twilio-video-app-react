import React from 'react';
import { shallow } from 'enzyme';
import Menu from './Menu';
import MoreIcon from '@material-ui/icons/MoreVert';
import UserAvatar from '../UserAvatar/UserAvatar';
import { useAppState } from '../../../state';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import { MenuItem } from '@material-ui/core';

jest.mock('../../../state');
jest.mock('../../../hooks/useVideoContext/useVideoContext');

const mockUseAppState = useAppState as jest.Mock<any>;
const mockUseVideoContext = useVideoContext as jest.Mock<any>;

describe('the Menu component', () => {
  const mockDisconnect = jest.fn();
  const mockTrack = { stop: jest.fn() };
  mockUseVideoContext.mockImplementation(() => ({ room: { disconnect: mockDisconnect }, localTracks: [mockTrack] }));

  describe('when there is a user', () => {
    it('should render the UserAvatar component', () => {
      mockUseAppState.mockImplementation(() => ({ user: {}, signOut: jest.fn() }));
      const wrapper = shallow(<Menu />);
      expect(wrapper.exists(UserAvatar)).toBe(true);
    });

    it('should include the logout button in the menu', () => {
      mockUseAppState.mockImplementation(() => ({ user: { displayName: 'Test User' }, signOut: jest.fn() }));
      const wrapper = shallow(<Menu />);
      expect(wrapper.contains('Logout')).toBe(true);
    });

    it('should display the user name in the menu', () => {
      mockUseAppState.mockImplementation(() => ({ user: { displayName: 'Test User' }, signOut: jest.fn() }));
      const wrapper = shallow(<Menu />);
      expect(wrapper.contains('Test User')).toBe(true);
    });

    it('should disconnect from the room and stop all tracks on signout', () => {
      const mockSignOut = jest.fn(() => Promise.resolve());
      mockUseAppState.mockImplementation(() => ({
        user: { displayName: 'Test User' },
        signOut: mockSignOut,
      }));
      const wrapper = shallow(<Menu />);
      wrapper
        .find(MenuItem)
        .last()
        .simulate('click');
      expect(mockDisconnect).toHaveBeenCalled();
      expect(mockTrack.stop).toHaveBeenCalled();
      expect(mockSignOut).toHaveBeenCalled();
    });
  });

  describe('when there is not a user', () => {
    it('should render the "More" icon', () => {
      mockUseAppState.mockImplementation(() => ({ user: null, signOut: jest.fn() }));
      const wrapper = shallow(<Menu />);
      expect(wrapper.exists(MoreIcon)).toBe(true);
    });

    it('should not display the user name in the menu', () => {
      mockUseAppState.mockImplementation(() => ({ user: { displayName: undefined }, signOut: jest.fn() }));
      const wrapper = shallow(<Menu />);
      expect(
        wrapper
          .find(MenuItem)
          .find({ disabled: true })
          .exists()
      ).toBe(false);
    });

    it('should not include the logout button in the menu', () => {
      mockUseAppState.mockImplementation(() => ({ user: null }));
      const wrapper = shallow(<Menu />);
      expect(wrapper.contains('Logout')).toBe(false);
    });
  });
});
