import React from 'react';
import LoginPage from './LoginPage';
import { act, fireEvent, render, waitForElement } from '@testing-library/react';
import { useAppState } from '../../state';
import { useLocation, useHistory } from 'react-router-dom';
import { setImmediate } from 'timers';

jest.mock('react-router-dom', () => {
  return {
    useLocation: jest.fn(),
    useHistory: jest.fn(),
  };
});
jest.mock('../../state');
jest.mock('./google-logo.svg', () => ({ ReactComponent: () => null }));

const mockUseAppState = useAppState as jest.Mock<any>;
const mockUseLocation = useLocation as jest.Mock<any>;
const mockUseHistory = useHistory as jest.Mock<any>;

const mockReplace = jest.fn();
mockUseHistory.mockImplementation(() => ({ replace: mockReplace }));
mockUseLocation.mockImplementation(() => ({ pathname: '/login' }));

describe('the LoginPage component', () => {
  beforeEach(jest.clearAllMocks);

  describe('with auth enabled', () => {
    it('should redirect to "/" when there is a user ', () => {
      process.env.REACT_APP_SET_AUTH = 'firebase';
      mockUseAppState.mockImplementation(() => ({ user: {}, signIn: () => Promise.resolve(), isAuthReady: true }));
      render(<LoginPage />);
      expect(mockReplace).toHaveBeenCalledWith('/');
    });

    it('should render the login page when there is no user', () => {
      process.env.REACT_APP_SET_AUTH = 'firebase';
      mockUseAppState.mockImplementation(() => ({ user: null, signIn: () => Promise.resolve(), isAuthReady: true }));
      const { getByText } = render(<LoginPage />);
      expect(mockReplace).not.toHaveBeenCalled();
      expect(getByText('Sign in with Google')).toBeTruthy();
    });

    it('should redirect the user to "/" after signIn when there is no previous location', done => {
      process.env.REACT_APP_SET_AUTH = 'firebase';
      mockUseAppState.mockImplementation(() => ({ user: null, signIn: () => Promise.resolve(), isAuthReady: true }));
      const { getByText } = render(<LoginPage />);
      getByText('Sign in with Google').click();
      setImmediate(() => {
        expect(mockReplace).toHaveBeenCalledWith({ pathname: '/' });
        done();
      });
    });

    it('should redirect the user to their previous location after signIn', done => {
      process.env.REACT_APP_SET_AUTH = 'firebase';
      mockUseLocation.mockImplementation(() => ({ state: { from: { pathname: '/room/test' } } }));
      mockUseAppState.mockImplementation(() => ({ user: null, signIn: () => Promise.resolve(), isAuthReady: true }));
      const { getByText } = render(<LoginPage />);
      getByText('Sign in with Google').click();
      setImmediate(() => {
        expect(mockReplace).toHaveBeenCalledWith({ pathname: '/room/test' });
        done();
      });
    });

    it('should not render anything when isAuthReady is false', () => {
      process.env.REACT_APP_SET_AUTH = 'firebase';
      mockUseAppState.mockImplementation(() => ({ user: null, signIn: () => Promise.resolve(), isAuthReady: false }));
      const { container } = render(<LoginPage />);
      expect(mockReplace).not.toHaveBeenCalled();
      expect(container.children[0]).toBe(undefined);
    });
  });

  describe('with passcode auth enabled', () => {
    it('should call sign in with the supplied passcode', done => {
      const mockSignin = jest.fn(() => Promise.resolve());
      process.env.REACT_APP_SET_AUTH = 'passcode';
      mockUseAppState.mockImplementation(() => ({ user: null, signIn: mockSignin, isAuthReady: true }));
      const { getByLabelText, getByText } = render(<LoginPage />);

      act(() => {
        fireEvent.change(getByLabelText('Passcode'), { target: { value: '1234' } });
      });
      act(() => {
        fireEvent.submit(getByText('Submit'));
      });

      setImmediate(() => {
        expect(mockSignin).toHaveBeenCalledWith('1234');
        done();
      });
    });

    it('should call render error messages when signin fails', async () => {
      const mockSignin = jest.fn(() => Promise.reject(new Error('Test Error')));
      process.env.REACT_APP_SET_AUTH = 'passcode';
      mockUseAppState.mockImplementation(() => ({ user: null, signIn: mockSignin, isAuthReady: true }));
      const { getByLabelText, getByText } = render(<LoginPage />);

      act(() => {
        fireEvent.change(getByLabelText('Passcode'), { target: { value: '1234' } });
      });

      act(() => {
        fireEvent.submit(getByText('Submit'));
      });

      const element = await waitForElement(() => getByText('Test Error'));
      expect(element).toBeTruthy();
    });
  });

  it('should redirect to "/" when auth is disabled', () => {
    delete process.env.REACT_APP_SET_AUTH;
    mockUseAppState.mockImplementation(() => ({ user: null, signIn: () => Promise.resolve(), isAuthReady: true }));
    render(<LoginPage />);
    expect(mockReplace).toHaveBeenCalledWith('/');
  });
});
