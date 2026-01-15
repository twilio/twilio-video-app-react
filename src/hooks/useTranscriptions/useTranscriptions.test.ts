import { renderHook, act } from '@testing-library/react-hooks';
import { useTranscriptions, TranscriptionEvent } from './useTranscriptions';

function createMockRoom() {
  let listeners: { [event: string]: Function[] } = {};
  return {
    on: (event: string, cb: Function) => {
      listeners[event] = listeners[event] || [];
      listeners[event].push(cb);
    },
    off: (event: string, cb: Function) => {
      listeners[event] = (listeners[event] || []).filter(fn => fn !== cb);
    },
    emit: (event: string, payload: any) => {
      (listeners[event] || []).forEach(fn => fn(payload));
    },
    state: 'connected',
  };
}

describe('useTranscriptions', () => {
  it('appends a final line when a final event arrives', () => {
    const room = createMockRoom();
    const { result } = renderHook(() => useTranscriptions(room as any));

    act(() => {
      room.emit('transcription', {
        participant: 'p1',
        transcription: 'Hello world',
        partial_results: false,
        absolute_time: new Date().toISOString(),
      } as TranscriptionEvent);
    });

    expect(result.current.lines).toHaveLength(1);
    expect(result.current.lines[0].text).toBe('Hello world');
    expect(result.current.live).toEqual([]);
  });

  it('updates live line for partials, commits on final', () => {
    const room = createMockRoom();
    const { result } = renderHook(() => useTranscriptions(room as any));

    act(() => {
      room.emit('transcription', {
        participant: 'p2',
        transcription: 'This is',
        partial_results: true,
        stability: 0.95,
      } as TranscriptionEvent);
    });

    expect(result.current.live).toHaveLength(1);
    expect(result.current.live[0].text).toBe('This is');
    expect(result.current.lines).toHaveLength(0);

    act(() => {
      room.emit('transcription', {
        participant: 'p2',
        transcription: 'This is final',
        partial_results: false,
      } as TranscriptionEvent);
    });

    expect(result.current.live).toEqual([]);
    expect(result.current.lines).toHaveLength(1);
    expect(result.current.lines[0].text).toBe('This is final');
  });

  it('keeps only last N committed lines', () => {
    const room = createMockRoom();
    const { result } = renderHook(() => useTranscriptions(room as any));

    act(() => {
      for (let i = 0; i < 7; i++) {
        room.emit('transcription', {
          participant: `p${i % 3}`,
          transcription: `Line ${i}`,
          partial_results: false,
        } as TranscriptionEvent);
      }
    });

    expect(result.current.lines).toHaveLength(3);
    expect(result.current.lines[0].text).toBe('Line 4');
    expect(result.current.lines[2].text).toBe('Line 6');
  });

  it('maintains separate live partials for multiple participants', () => {
    const room = createMockRoom();
    const { result } = renderHook(() => useTranscriptions(room as any));

    // Participant 1 starts speaking
    act(() => {
      room.emit('transcription', {
        participant: 'p1',
        transcription: 'Hello from p1',
        partial_results: true,
        stability: 0.95,
      } as TranscriptionEvent);
    });

    expect(result.current.live).toHaveLength(1);
    expect(result.current.live[0].text).toBe('Hello from p1');

    // Participant 2 starts speaking - should not overwrite p1's partial
    act(() => {
      room.emit('transcription', {
        participant: 'p2',
        transcription: 'Hi from p2',
        partial_results: true,
        stability: 0.95,
      } as TranscriptionEvent);
    });

    expect(result.current.live).toHaveLength(2);
    const participants = result.current.live.map(l => l.participant);
    expect(participants).toContain('p1');
    expect(participants).toContain('p2');

    // Participant 1 finishes - should remove only p1's partial
    act(() => {
      room.emit('transcription', {
        participant: 'p1',
        transcription: 'Hello from p1 final',
        partial_results: false,
      } as TranscriptionEvent);
    });

    expect(result.current.lines).toHaveLength(1);
    expect(result.current.lines[0].text).toBe('Hello from p1 final');
    expect(result.current.live).toHaveLength(1);
    expect(result.current.live[0].participant).toBe('p2');
    expect(result.current.live[0].text).toBe('Hi from p2');

    // Participant 2 finishes
    act(() => {
      room.emit('transcription', {
        participant: 'p2',
        transcription: 'Hi from p2 final',
        partial_results: false,
      } as TranscriptionEvent);
    });

    expect(result.current.lines).toHaveLength(2);
    expect(result.current.live).toEqual([]);
  });
});
