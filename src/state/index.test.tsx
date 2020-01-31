import React from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import { TwilioError } from 'twilio-video';

import AppStateProvider, { useAppState } from './index';

jest.mock('./useAuth/useAuth', () => () => ({
  user: {
    getIdToken: () => Promise.resolve('mockFirebaseToken'),
  },
}));

// @ts-ignore
window.fetch = jest.fn(() => Promise.resolve({ text: () => 'mockVideoToken' }));

const wrapper: React.FC = ({ children }) => <AppStateProvider>{children}</AppStateProvider>;

describe('the useAppState hook', () => {
  beforeEach(jest.clearAllMocks);
  beforeEach(() => (process.env = {} as any));

  it('should set a token', () => {
    const { result } = renderHook(useAppState, { wrapper });
    act(() => result.current.setToken('test'));
    expect(result.current.token).toBe('test');
  });

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

    const { result, waitForNextUpdate } = renderHook(useAppState, { wrapper });
    result.current.getToken('testname', 'testroom');

    await waitForNextUpdate();

    expect(window.fetch).toHaveBeenCalledWith('http://test.com/api/token?identity=testname&roomName=testroom', {
      headers: { _headers: {} },
    });
  });

  describe('with auth disabled', () => {
    it('should get a token from the local token server', async () => {
      process.env.REACT_APP_USE_FIREBASE_AUTH = 'false';

      const { result, waitForNextUpdate } = renderHook(useAppState, { wrapper });
      result.current.getToken('testname', 'testroom');

      await waitForNextUpdate();

      expect(window.fetch).toHaveBeenCalledWith('/token?identity=testname&roomName=testroom', {
        headers: { _headers: {} },
      });
      expect(result.current.token).toBe('mockVideoToken');
    });
  });

  describe('with auth enabled', () => {
    it("should include the user's firebase ID token in the authorization header", async () => {
      process.env.REACT_APP_USE_FIREBASE_AUTH = 'true';

      const { result, waitForNextUpdate } = renderHook(useAppState, { wrapper });
      result.current.getToken('testname', 'testroom');

      await waitForNextUpdate();

      expect(window.fetch).toHaveBeenCalledWith('/token?identity=testname&roomName=testroom', {
        headers: { _headers: { authorization: ['mockFirebaseToken'] } },
      });
      expect(result.current.token).toBe('mockVideoToken');
    });
  });
});
