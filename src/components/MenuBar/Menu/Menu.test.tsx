import React from 'react';
import { shallow } from 'enzyme';
import Menu from './Menu';
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
    it('should include the logout button in the menu', () => {
      mockUseAppState.mockImplementation(() => ({ user: { displayName: 'Test User' }, signOut: jest.fn() }));
      const wrapper = shallow(<Menu />);
      expect(wrapper.contains('Logout')).toBe(true);
    });

    it('should disconnect from the room and stop all tracks when the Logout button is clicked', () => {
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
    it('should not include the logout button in the menu', () => {
      mockUseAppState.mockImplementation(() => ({ user: null }));
      const wrapper = shallow(<Menu />);
      expect(wrapper.contains('Logout')).toBe(false);
    });
  });
});
