import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useAppState } from '../../state';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { useTranscriptions } from '../../hooks/useTranscriptions/useTranscriptions';

export type TranscriptionLine = {
  text: string;
  participant: string;
  time: number;
};

const useStyles = makeStyles((theme: Theme) => ({
  overlay: {
    position: 'fixed',
    left: '50%',
    bottom: 64,
    transform: 'translateX(-50%)',
    maxWidth: 960,
    width: '80vw',
    margin: '0 auto',
    background: 'rgba(51, 51, 51, 0.8)',
    color: '#fff',
    borderRadius: '1.25rem',
    boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
    padding: '1.25rem 2rem',
    zIndex: 1000,
    fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
    transition: 'opacity 0.3s ease',
    opacity: 1,
    pointerEvents: 'auto',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  line: {
    opacity: 0.8,
    fontSize: '0.875rem',
    fontWeight: 400,
    letterSpacing: '0.01em',
    transition: 'opacity 0.3s ease',
    color: '#fff',
    textShadow: '0 1px 2px #222',
  },
  liveLine: {
    opacity: 0.6,
    fontStyle: 'italic',
    fontSize: '0.875rem',
    fontWeight: 400,
    letterSpacing: '0.01em',
    color: '#fff',
    textShadow: '0 1px 2px #222',
    transition: 'opacity 0.3s ease',
  },
  participant: {
    fontWeight: 600,
    marginRight: 8,
  },
}));

export const TranscriptionsOverlay: React.FC = () => {
  const classes = useStyles();
  const { isCaptionsEnabled } = useAppState();
  const { room } = useVideoContext();

  const isConnected = !!room && room.state === 'connected';
  const captionsVisible = isCaptionsEnabled && isConnected;

  const { lines, live } = useTranscriptions(room, { enabled: captionsVisible });

  if (!captionsVisible) return null;

  const recentLines = lines.slice(-5);
  const hasContent = recentLines.length > 0 || (live && live.text);

  if (!hasContent) return null;

  return (
    <div role="region" aria-label="Live Transcriptions" className={classes.overlay}>
      <div className={classes.container}>
        {recentLines.map((line, idx) => (
          <div
            key={line.time + line.participant + idx}
            className={classes.line}
            aria-live={idx === recentLines.length - 1 ? 'polite' : undefined}
          >
            <span className={classes.participant}>{line.participant}:</span>
            <span>{line.text}</span>
          </div>
        ))}
        {live && live.text && (
          <div className={classes.liveLine} aria-live="polite">
            <span className={classes.participant}>{live.participant}:</span>
            <span>{live.text}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranscriptionsOverlay;
