import React from 'react';
import { act, renderHook } from '@testing-library/react-hooks';

import AppStateProvider, { useAppState } from './index';
import useFirebaseAuth from './useFirebaseAuth/useFirebaseAuth';
import usePasscodeAuth from './usePasscodeAuth/usePasscodeAuth';

jest.mock('./useFirebaseAuth/useFirebaseAuth', () => jest.fn(() => ({ user: 'firebaseUser' })));
jest.mock('./usePasscodeAuth/usePasscodeAuth', () => jest.fn(() => ({ user: 'passcodeUser' })));
jest.mock('./useActiveSinkId/useActiveSinkId.ts', () => () => ['default', () => {}]);

const mockUsePasscodeAuth = usePasscodeAuth as jest.Mock<any>;

// @ts-ignore
window.fetch = jest.fn(() =>
  Promise.resolve({
    text: () => 'mockVideoToken',
    json: () => ({
      token: 'mockVideoToken',
    }),
  })
);

const wrapper: React.FC = ({ children }) => <AppStateProvider>{children}</AppStateProvider>;

describe('the useAppState hook', () => {
  beforeEach(jest.clearAllMocks);
  beforeEach(() => (process.env = {} as any));

  it('should set an error', () => {
    const { result } = renderHook(useAppState, { wrapper });
    act(() => result.current.setError(new Error('testError')));
    expect(result.current.error!.message).toBe('testError');
  });

  it('should throw an error if used outside of AppStateProvider', () => {
    const { result } = renderHook(useAppState);
    expect(result.error.message).toEqual('useAppState must be used within the AppStateProvider');
  });

  it('should get a token using the REACT_APP_TOKEN_ENDPOINT environment variable when avaiable', async () => {
    process.env.REACT_APP_TOKEN_ENDPOINT = 'http://test.com/api/token';

    const { result } = renderHook(useAppState, { wrapper });

    let token;
    await act(async () => {
      token = await result.current.getToken('testname', 'testroom');
    });

    expect(token).toEqual({ token: 'mockVideoToken' });

    expect(window.fetch).toHaveBeenCalledWith('http://test.com/api/token', {
      headers: { 'content-type': 'application/json' },
      body: '{"user_identity":"testname","room_name":"testroom","create_conversation":true}',
      method: 'POST',
    });
  });

  describe('with auth disabled', () => {
    it('should not use any auth hooks', async () => {
      delete process.env.REACT_APP_SET_AUTH;
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
      expect(result.current.user).toBe('firebaseUser');
    });
  });

  describe('with passcode auth enabled', () => {
    it('should use the usePasscodeAuth hook', async () => {
      process.env.REACT_APP_SET_AUTH = 'passcode';
      const { result } = renderHook(useAppState, { wrapper });
      expect(usePasscodeAuth).toHaveBeenCalled();
      expect(result.current.user).toBe('passcodeUser');
    });
  });

  describe('the getToken function', () => {
    it('should set isFetching to true after getToken is called, and false after getToken succeeds', async () => {
      // Using passcode auth because it's easier to mock the getToken function
      process.env.REACT_APP_SET_AUTH = 'passcode';
      mockUsePasscodeAuth.mockImplementation(() => {
        return {
          getToken: () =>
            new Promise(resolve => {
              // Using fake timers so we can control when the promise resolves
              setTimeout(() => resolve({ text: () => 'mockVideoToken' }), 10);
            }),
        };
      });

      jest.useFakeTimers();

      const { result, waitForNextUpdate } = renderHook(useAppState, { wrapper });

      expect(result.current.isFetching).toEqual(false);

      await act(async () => {
        result.current.getToken('test', 'test');
        await waitForNextUpdate();
        expect(result.current.isFetching).toEqual(true);
        jest.runOnlyPendingTimers();
        await waitForNextUpdate();
        expect(result.current.isFetching).toEqual(false);
      });
    });

    it('should set isFetching to true after getToken is called, and false after getToken fails', async () => {
      process.env.REACT_APP_SET_AUTH = 'passcode';
      mockUsePasscodeAuth.mockImplementation(() => {
        return {
          getToken: () =>
            new Promise((_, reject) => {
              setTimeout(() => reject({ text: () => 'mockVideoToken' }), 10);
            }),
        };
      });

      jest.useFakeTimers();

      const { result, waitForNextUpdate } = renderHook(useAppState, { wrapper });

      expect(result.current.isFetching).toEqual(false);

      await act(async () => {
        result.current.getToken('test', 'test').catch(() => {});
        await waitForNextUpdate();
        expect(result.current.isFetching).toEqual(true);
        jest.runOnlyPendingTimers();
        await waitForNextUpdate();
        expect(result.current.isFetching).toEqual(false);
      });
    });
  });
});
