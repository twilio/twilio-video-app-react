import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import CloseIcon from '../../../icons/CloseIcon';

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      minHeight: '56px',
      background: '#F4F4F6',
      borderBottom: '1px solid #E4E7E9',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 1em',
    },
    text: {
      fontWeight: 'bold',
    },
    closeMaskSelection: {
      cursor: 'pointer',
      display: 'flex',
      background: 'transparent',
      border: '0',
      padding: '0.4em',
    },
  })
);

interface MaskSelectionHeaderProps {
  onClose: () => void;
}

export default function MaskSelectionHeader({ onClose }: MaskSelectionHeaderProps) {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.text}>Mask Effects</div>
      <button className={classes.closeMaskSelection} onClick={onClose}>
        <CloseIcon />
      </button>
    </div>
  );
}
