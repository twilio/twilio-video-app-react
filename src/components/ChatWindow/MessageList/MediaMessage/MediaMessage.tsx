import React from 'react';
import FileDownloadIcon from '../../../../icons/FileDownloadIcon';
import { makeStyles } from '@material-ui/core/styles';
import { Media } from '@twilio/conversations/lib/media';
import { Grid } from '@material-ui/core';

const useStyles = makeStyles({
  messageContainer: {
    display: 'flex',
    padding: '0.9em 1.5em',
    margin: '0.6em 0',
    border: '2px solid #e4e7e9',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  mediaInfo: {
    marginLeft: '1.5em',
    '& p': {
      margin: 0,
      fontSize: '12px',
    },
  },
  filename: {
    fontWeight: 700,
  },
  size: {
    fontWeight: 400,
  },
});

interface MediaMessageProps {
  media: Media;
}

function formatFileSize(bytes: number, suffixIndex = 0) {
  const suffixes = ['bytes', 'KB', 'MB', 'GB'];
  if (bytes < 1000) return +bytes.toFixed(2) + ' ' + suffixes[suffixIndex];
  formatFileSize(bytes / 1000, suffixIndex + 1);
}

export default function FileMessage({ media }: MediaMessageProps) {
  const classes = useStyles();

  const handleClick = () => {
    media.getContentTemporaryUrl().then(url => {
      const anchorEl = document.createElement('a');

      anchorEl.download = media.filename;
      anchorEl.href = url;
      anchorEl.target = '_blank';
      anchorEl.rel = 'noopener';

      anchorEl.click();
    });
  };

  return (
    <div className={classes.messageContainer} onClick={handleClick}>
      <FileDownloadIcon />
      <Grid container alignItems="center" className={classes.mediaInfo}>
        <div>
          <p className={classes.filename}>{media.filename}</p>
          <p className={classes.size}>{formatFileSize(media.size)} - Click to open</p>
        </div>
      </Grid>
    </div>
  );
}
