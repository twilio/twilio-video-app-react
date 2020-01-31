import React from 'react';
import { shallow } from 'enzyme';
import UserAvatar, { getInitials } from './UserAvatar';
import { useAppState } from '../../../state';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import { Avatar, Menu, MenuItem } from '@material-ui/core';
import Person from '@material-ui/icons/Person';

jest.mock('../../../state');
jest.mock('../../../hooks/useVideoContext/useVideoContext');

const mockUseAppState = useAppState as jest.Mock<any>;
const mockUseVideoContext = useVideoContext as jest.Mock<any>;

describe('the UserAvatar component', () => {
  const mockDisconnect = jest.fn();
  const mockTrack = { stop: jest.fn() };
  mockUseVideoContext.mockImplementation(() => ({ room: { disconnect: mockDisconnect }, localTracks: [mockTrack] }));

  it('should display the users initials when there is a displayName property', () => {
    mockUseAppState.mockImplementation(() => ({ user: { displayName: 'Test User' }, signOut: jest.fn() }));
    const wrapper = shallow(<UserAvatar />);
    expect(wrapper.find(Avatar).text()).toBe('TU');
  });

  it('should display the Person icon when there is no displayName or photoURL properties', () => {
    mockUseAppState.mockImplementation(() => ({ user: {}, signOut: jest.fn() }));
    const wrapper = shallow(<UserAvatar />);
    expect(wrapper.find(Person).exists()).toBe(true);
  });

  it('should display the users photo when the photoURL property exists', () => {
    mockUseAppState.mockImplementation(() => ({ user: { photoURL: 'testURL' }, signOut: jest.fn() }));
    const wrapper = shallow(<UserAvatar />);
    expect(
      wrapper
        .find(Avatar)
        .find({ src: 'testURL' })
        .exists()
    ).toBe(true);
  });

  it('should return null when there is no user', () => {
    mockUseAppState.mockImplementation(() => ({ user: null, signOut: jest.fn() }));
    const wrapper = shallow(<UserAvatar />);
    expect(wrapper.get(0)).toBe(null);
  });

  it('should display the user name in the menu', () => {
    mockUseAppState.mockImplementation(() => ({ user: { displayName: 'Test User' }, signOut: jest.fn() }));
    const wrapper = shallow(<UserAvatar />);
    expect(
      wrapper
        .find(MenuItem)
        .at(0)
        .text()
    ).toBe('Test User');
  });

  it('should disconnect from the room and stop all tracks on signout', done => {
    mockUseAppState.mockImplementation(() => ({
      user: { displayName: 'Test User' },
      signOut: jest.fn(() => Promise.resolve()),
    }));
    const wrapper = shallow(<UserAvatar />);
    wrapper
      .find(MenuItem)
      .at(1)
      .simulate('click');
    setImmediate(() => {
      expect(mockDisconnect).toHaveBeenCalled();
      expect(mockTrack.stop).toHaveBeenCalled();
      done();
    });
  });

  describe('getInitials function', () => {
    it('should generate initials from a name', () => {
      expect(getInitials('test')).toBe('T');
      expect(getInitials('Test User')).toBe('TU');
      expect(getInitials('test User TWO')).toBe('TUT');
    });
  });
});
