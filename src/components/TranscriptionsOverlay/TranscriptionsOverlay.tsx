import React from 'react';

/**
 * Overlay component for displaying Twilio Real-Time Transcriptions.
 *
 * See official docs:
 * - Overview: https://www.twilio.com/docs/video/api/real-time-transcriptions
 * - JS SDK usage: https://www.twilio.com/docs/video/api/real-time-transcriptions#receiving-transcriptions-in-the-js-sdk
 *
 * Props:
 *   lines: Array of committed transcription lines.
 *   live: Optional live partial line.
 *   visible: Show/hide overlay.
 */

export type TranscriptionLine = {
  text: string;
  participant: string;
  time: number;
};

type Props = {
  lines: TranscriptionLine[];
  live?: { text: string; participant: string } | null;
  visible: boolean;
};

export const TranscriptionsOverlay: React.FC<Props> = ({ lines, live, visible }) => {
  if (!visible) return null;

  // Show last 3-5 lines
  const recentLines = lines.slice(-5);

  return (
    <div
      role="region"
      aria-label="Live Transcriptions"
      style={{
        position: 'fixed',
        left: '50%',
        bottom: 64,
        transform: 'translateX(-50%)',
        maxWidth: 960,
        width: '80vw', // 20% narrower
        margin: '0 auto', // center
        background: 'rgba(51, 51, 51, 0.8)', // medium grey, slight transparency
        color: '#fff', // high-contrast text
        borderRadius: '1.25rem',
        boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
        padding: '1.25rem 2rem',
        zIndex: 1000,
        fontSize: 'clamp(0.875rem, 1.5vw, 1rem)', // smaller, responsive
        transition: 'opacity 0.3s var(--motion-ease, ease)',
        opacity: 1,
        pointerEvents: 'auto',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {recentLines.map((line, idx) => (
          <div
            key={line.time + line.participant + idx}
            style={{
              opacity: 0.8,
              fontSize: '0.875rem', // ~14px, subtle
              fontWeight: 400,
              letterSpacing: '0.01em',
              transition: 'opacity 0.3s var(--motion-ease, ease)',
              color: '#fff',
              textShadow: '0 1px 2px #222',
            }}
            aria-live={idx === recentLines.length - 1 ? 'polite' : undefined}
          >
            <span style={{ fontWeight: 600, marginRight: 8 }}>{line.participant}:</span>
            <span>{line.text}</span>
          </div>
        ))}
        {live && live.text && (
          <div
            style={{
              opacity: 0.6,
              fontStyle: 'italic',
              fontSize: '0.875rem', // ~14px, subtle
              fontWeight: 400,
              letterSpacing: '0.01em',
              color: '#fff',
              textShadow: '0 1px 2px #222',
              transition: 'opacity 0.3s var(--motion-ease, ease)',
            }}
            aria-live="polite"
          >
            <span style={{ fontWeight: 600, marginRight: 8 }}>{live.participant}:</span>
            <span>{live.text}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranscriptionsOverlay;
