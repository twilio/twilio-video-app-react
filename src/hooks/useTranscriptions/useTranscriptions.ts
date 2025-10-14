import { useEffect, useRef, useState, useCallback } from 'react';
import { Room } from 'twilio-video';

/**
 * React hook for Twilio Real-Time Transcriptions.
 *
 * See official docs:
 * - Overview: https://www.twilio.com/docs/video/api/real-time-transcriptions
 * - Console defaults & REST configuration: https://www.twilio.com/docs/video/api/real-time-transcriptions#enabling-real-time-transcriptions
 * - JS SDK usage: https://www.twilio.com/docs/video/api/real-time-transcriptions#receiving-transcriptions-in-the-js-sdk
 *
 * Usage:
 *   const { lines, live, clear } = useTranscriptions(room);
 *   room.on('transcription', event => ...);
 *   Pass receiveTranscriptions: true in ConnectOptions.
 */

const STABILITY_THRESHOLD = 0.9;

export type TranscriptionEvent = {
  participant: string; // display name or SID
  transcription: string; // text content
  partial_results?: boolean; // true if partial
  stability?: number; // present on partials; not present on finals
  sequence_number?: number;
  track?: string;
  timestamp?: string;
  absolute_time?: string; // ISO 8601
  language_code?: string;
};

export type TranscriptionLine = {
  text: string;
  participant: string;
  time: number;
};

type UseTranscriptionsResult = {
  lines: TranscriptionLine[];
  live?: TranscriptionLine | null;
  push: (event: TranscriptionEvent) => void;
  clear: () => void;
};

const MAX_TOTAL_LINES = 3;
const MAX_LINES_PER_PARTICIPANT = 2;

/**
 * Format participant display string as PA..1234 (last 4 chars of SID).
 */
function formatParticipant(participant: string): string {
  if (!participant) return '';
  if (/^PA[a-zA-Z0-9]+$/.test(participant) && participant.length > 4) {
    return `PA..${participant.slice(-4)}`;
  }
  return participant;
}

export function useTranscriptions(room: Room | null, opts: { enabled?: boolean } = {}): UseTranscriptionsResult {
  const enabled = opts.enabled !== undefined ? opts.enabled : true;
  const [lines, setLines] = useState<TranscriptionLine[]>([]);
  const [live, setLive] = useState<TranscriptionLine | null>(null);
  const liveRef = useRef<{ [sid: string]: TranscriptionLine }>({});

  const clear = useCallback(() => {
    setLines([]);
    setLive(null);
    liveRef.current = {};
  }, []);

  const push = useCallback(
    (event: TranscriptionEvent) => {
      if (!enabled) return;
      const participant = formatParticipant(event.participant);
      const text = event.transcription;
      const time = event.absolute_time ? Date.parse(event.absolute_time) : Date.now();

      if (event.partial_results) {
        // Drop low-stability partials: only show partials with stability >= threshold.
        // Finals are always committed regardless of stability.
        const stab = typeof event.stability === 'number' ? event.stability : 0;
        if (stab < STABILITY_THRESHOLD) {
          // Ignore low-stability partials; keep showing the last acceptable partial
          return;
        }
        // Store/update live partial for participant
        const liveLine: TranscriptionLine = { text, participant, time };
        liveRef.current[participant] = liveLine;
        setLive(liveLine);
      } else {
        // Final result: move from live to committed
        const finalLine: TranscriptionLine = { text, participant, time };
        setLines(prev => {
          // Add new line
          const updated = [...prev, finalLine];

          // Enforce max per participant
          const perParticipant: { [sid: string]: TranscriptionLine[] } = {};
          updated.forEach(line => {
            if (!perParticipant[line.participant]) perParticipant[line.participant] = [];
            perParticipant[line.participant].push(line);
          });

          // Remove oldest lines if any participant exceeds MAX_LINES_PER_PARTICIPANT
          let filtered = updated;
          Object.keys(perParticipant).forEach(sid => {
            const arr = perParticipant[sid];
            if (arr.length > MAX_LINES_PER_PARTICIPANT) {
              // Remove oldest for this participant
              const toRemove = arr.length - MAX_LINES_PER_PARTICIPANT;
              let count = 0;
              filtered = filtered.filter(line => {
                if (line.participant === sid && count < toRemove) {
                  count++;
                  return false;
                }
                return true;
              });
            }
          });

          // Enforce max total lines
          if (filtered.length > MAX_TOTAL_LINES) {
            filtered = filtered.slice(filtered.length - MAX_TOTAL_LINES);
          }

          return filtered;
        });
        // Remove live partial for participant
        delete liveRef.current[participant];
        setLive(null);
      }
    },
    [enabled]
  );

  useEffect(() => {
    if (!room || !enabled) {
      clear();
      return;
    }

    const handler = (event: TranscriptionEvent) => {
      if (!enabled) return;
      push(event);
    };

    room.on('transcription', handler);

    // Clear on disconnect
    const disconnectHandler = () => {
      clear();
    };
    room.on('disconnected', disconnectHandler);

    return () => {
      room.off('transcription', handler);
      room.off('disconnected', disconnectHandler);
      clear();
    };
  }, [room, push, clear, enabled]);

  if (!room) {
    return { lines: [], push: () => {}, clear: () => {} };
  }

  return { lines, live, push, clear };
}
