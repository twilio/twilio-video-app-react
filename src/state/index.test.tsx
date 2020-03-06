import React from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import { TwilioError } from 'twilio-video';

import AppStateProvider, { useAppState } from './index';
import useFirebaseAuth from './useFirebaseAuth/useFirebaseAuth';
import usePasscodeAuth from './usePasscodeAuth/usePasscodeAuth';

jest.mock('./useFirebaseAuth/useFirebaseAuth', () => jest.fn(() => ({ user: 'firebaseUser' })));
jest.mock('./usePasscodeAuth/usePasscodeAuth', () => jest.fn(() => ({ user: 'passcodeUser' })));

// @ts-ignore
window.fetch = jest.fn(() => Promise.resolve({ text: () => 'mockVideoToken' }));

const wrapper: React.FC = ({ children }) => <AppStateProvider>{children}</AppStateProvider>;

describe('the useAppState hook', () => {
  beforeEach(jest.clearAllMocks);
  beforeEach(() => (process.env = {} as any));

  it('should set an error', () => {
    const { result } = renderHook(useAppState, { wrapper });
    act(() => result.current.setError(new Error('testError') as TwilioError));
    expect(result.current.error!.message).toBe('testError');
  });

  it('should throw an error if used outside of AppStateProvider', () => {
    const { result } = renderHook(useAppState);
    expect(result.error.message).toEqual('useAppState must be used within the AppStateProvider');
  });

  it('should get a token using the REACT_APP_TOKEN_ENDPOINT environment variable when avaiable', async () => {
    process.env.REACT_APP_TOKEN_ENDPOINT = 'http://test.com/api/token';

    const { result } = renderHook(useAppState, { wrapper });

    const token = await result.current.getToken('testname', 'testroom');
    expect(token).toBe('mockVideoToken');

    expect(window.fetch).toHaveBeenCalledWith('http://test.com/api/token?identity=testname&roomName=testroom', {
      headers: { _headers: {} },
    });
  });

  describe('with auth disabled', () => {
    it('should not use any auth hooks', async () => {
      delete process.env.REACT_APP_USE_FIREBASE_AUTH;
      renderHook(useAppState, { wrapper });
      expect(useFirebaseAuth).not.toHaveBeenCalled();
      expect(usePasscodeAuth).not.toHaveBeenCalled();
    });
  });

  describe('with firebase auth enabled', () => {
    it('should use the useFirebaseAuth hook', async () => {
      process.env.REACT_APP_SET_AUTH = 'firebase';
      const { result } = renderHook(useAppState, { wrapper });
      expect(useFirebaseAuth).toHaveBeenCalled();
      expect(result.current.user).toBe('firebaseUser')
    });
  });

  describe('with passcode auth enabled', () => {
    it('should use the usePasscodeAuth hook', async () => {
      process.env.REACT_APP_SET_AUTH = 'passcode';
      const { result } = renderHook(useAppState, { wrapper });
      expect(usePasscodeAuth).toHaveBeenCalled();
      expect(result.current.user).toBe('passcodeUser')
    });
  });
});
