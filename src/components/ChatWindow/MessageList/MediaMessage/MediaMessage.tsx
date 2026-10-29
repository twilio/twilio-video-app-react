import FileDownloadIcon from '../../../../icons/FileDownloadIcon';
import { makeStyles } from '@material-ui/core/styles';
import { Media } from '@twilio/conversations';

const useStyles = makeStyles({
  messageContainer: {
    display: 'flex',
    padding: '0.9em 1.5em',
    margin: '0.6em 0',
    border: '2px solid #e4e7e9',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  mediaInfo: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: '1.5em',
    minWidth: 0,
    '& p': {
      margin: 0,
      fontSize: '12px',
    },
  },
  filename: {
    fontWeight: 700,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  size: {
    fontWeight: 400,
  },
});

interface MediaMessageProps {
  media: Media;
}

export function formatFileSize(bytes: number, suffixIndex = 0): string {
  const suffixes = ['bytes', 'KB', 'MB', 'GB'];
  if (bytes < 1000) return +bytes.toFixed(2) + ' ' + suffixes[suffixIndex];
  return formatFileSize(bytes / 1024, suffixIndex + 1);
}

export default function FileMessage({ media }: MediaMessageProps) {
  const classes = useStyles();

  const handleClick = async () => {
    try {
      const url = await media.getContentTemporaryUrl();

      if (!url) {
        throw new Error('Unable to get media download URL');
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const anchorEl = document.createElement('a');

      anchorEl.href = downloadUrl;
      anchorEl.download = media.filename || 'download';

      setTimeout(() => {
        anchorEl.click();

        setTimeout(() => {
          URL.revokeObjectURL(downloadUrl);
        }, 100);
      });
    } catch (error) {
      console.error('Failed to download media:', error);
    }
  };

  return (
    <div className={classes.messageContainer} onClick={handleClick}>
      <div className={classes.iconContainer}>
        <FileDownloadIcon />
      </div>
      <div className={classes.mediaInfo}>
        <p className={classes.filename}>{media.filename}</p>
        <p className={classes.size}>{formatFileSize(media.size)} - Click to Download</p>
      </div>
    </div>
  );
}
