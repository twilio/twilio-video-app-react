import React from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import { TwilioError } from 'twilio-video';

import AppStateProvider, { useAppState } from './index';

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

  it('should get a token from the API', async () => {
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

  it('should throw an error if used outside of AppStateProvider', () => {
    const { result } = renderHook(useAppState);
    expect(result.error.message).toEqual('useAppState must be used within the AppStateProvider');
  });
});
