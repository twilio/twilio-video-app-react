import React from 'react';
import useSelectedParticipant, { SelectedParticipantProvider } from './useSelectedParticipant';
import { renderHook, act } from '@testing-library/react-hooks';

describe('the useSelectedParticipant hook', () => {
  it('should return null as the default value', () => {
    const { result } = renderHook(useSelectedParticipant, {
      wrapper: ({ children }) => <SelectedParticipantProvider>{children}</SelectedParticipantProvider>,
    });
    expect(result.current[0]).toBe(null);
  });

  it('should set a selected participant', () => {
    const { result } = renderHook(useSelectedParticipant, {
      wrapper: ({ children }) => <SelectedParticipantProvider>{children}</SelectedParticipantProvider>,
    });

    act(() => result.current[1]('mockParticipant' as any));

    expect(result.current[0]).toBe('mockParticipant');
  });

  it('should set "null" as the selected participant when the user selects the currently selected participant', () => {
    const { result } = renderHook(useSelectedParticipant, {
      wrapper: ({ children }) => <SelectedParticipantProvider>{children}</SelectedParticipantProvider>,
    });

    act(() => result.current[1]('mockParticipant' as any));
    act(() => result.current[1]('mockParticipant' as any));

    expect(result.current[0]).toBe(null);
  });
});
