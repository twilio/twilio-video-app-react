import React from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import { TwilioError } from 'twilio-video';

import AppStateProvider, { useAppState } from './index';
// import useAuth from './useAuth/useAuth';

jest.mock('./useAuth/useAuth', () => () => ({
  user: {
    getIdToken: () => Promise.resolve('mockToken'),
  },
}));

const wrapper: React.FC = ({ children }) => <AppStateProvider>{children}</AppStateProvider>;

describe('the useAppState hook', () => {
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

  describe('with auth disabled', () => {
    it('should get a token from the local token server', async () => {
      process.env.REACT_APP_USE_FIREBASE_AUTH = 'false';

      // @ts-ignore
      window.fetch = jest.fn(() => Promise.resolve({ json: () => ({ token: 'testToken' }) }));

      const { result, waitForNextUpdate } = renderHook(useAppState, { wrapper });
      result.current.getToken('testname', 'testroom');

      await waitForNextUpdate();

      expect(window.fetch).toHaveBeenCalledWith(
        '/token',
        expect.objectContaining({ body: JSON.stringify({ name: 'testname', room: 'testroom' }) })
      );
      expect(result.current.token).toBe('testToken');
    });
  });

  describe('with auth enabled', () => {
    it('should get a token from the video-app-service', async () => {
      process.env.REACT_APP_USE_FIREBASE_AUTH = 'true';

      // @ts-ignore
      window.fetch = jest.fn(() => Promise.resolve({ text: () => 'testToken' }));

      const { result, waitForNextUpdate } = renderHook(useAppState, { wrapper });
      result.current.getToken('testname', 'testroom');

      await waitForNextUpdate();

      expect(window.fetch).toHaveBeenCalledWith(
        'https://app.video.bytwilio.com/api/v1/token?roomName=testroom&identity=testname',
        expect.objectContaining({ headers: { Authorization: 'mockToken' } })
      );
      expect(result.current.token).toBe('testToken');
    });
  });
});
