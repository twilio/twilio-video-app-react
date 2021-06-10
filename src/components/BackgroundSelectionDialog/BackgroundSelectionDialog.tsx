import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import BackgroundSelectionHeader from './BackgroundSelectionHeader/BackgroundSelectionHeader';
import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  drawer: {
    display: 'flex',
    width: '20vw',
    height: `calc(100% - ${theme.footerHeight}px)`,
  },
}));

interface BackgroundSelectionProps {
  open: boolean;
  onClose: () => void;
}

function BackgroundSelectionDialog({ open, onClose }: BackgroundSelectionProps) {
  const classes = useStyles();

  return (
    <Drawer
      variant="persistent"
      anchor="right"
      open={open}
      classes={{
        paper: classes.drawer,
      }}
    >
      <BackgroundSelectionHeader onClose={onClose} />
      {
        // TODO Implement background selection logic and front end
      }
    </Drawer>
  );
}

export default BackgroundSelectionDialog;
