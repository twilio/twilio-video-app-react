import { act, renderHook } from '@testing-library/react-hooks';
import { EventEmitter } from 'events';
import React from 'react';
import { Room } from 'twilio-video';
import useSelectedParticipant, { SelectedParticipantProvider } from './useSelectedParticipant';

describe('the useSelectedParticipant hook', () => {
  let mockRoom: Room;
  beforeEach(() => (mockRoom = new EventEmitter() as Room));

  it('should return null as the default value', () => {
    const { result } = renderHook(useSelectedParticipant, {
      wrapper: ({ children }) => <SelectedParticipantProvider room={mockRoom}>{children}</SelectedParticipantProvider>,
    });
    expect(result.current[0]).toBe(null);
  });

  it('should set a selected participant', () => {
    const { result } = renderHook(useSelectedParticipant, {
      wrapper: ({ children }) => <SelectedParticipantProvider room={mockRoom}>{children}</SelectedParticipantProvider>,
    });

    act(() => result.current[1]('mockParticipant' as any));

    expect(result.current[0]).toBe('mockParticipant');
  });

  it('should set "null" as the selected participant when the user selects the currently selected participant', () => {
    const { result } = renderHook(useSelectedParticipant, {
      wrapper: ({ children }) => <SelectedParticipantProvider room={mockRoom}>{children}</SelectedParticipantProvider>,
    });

    act(() => result.current[1]('mockParticipant' as any));
    act(() => result.current[1]('mockParticipant' as any));

    expect(result.current[0]).toBe(null);
  });

  it('should set "null" as the selected participant on room disconnect', () => {
    const { result } = renderHook(useSelectedParticipant, {
      wrapper: ({ children }) => <SelectedParticipantProvider room={mockRoom}>{children}</SelectedParticipantProvider>,
    });

    act(() => result.current[1]('mockParticipant' as any));
    expect(result.current[0]).toBe('mockParticipant');
    act(() => {
      mockRoom.emit('disconnected');
    });
    expect(result.current[0]).toBe(null);
  });
});
