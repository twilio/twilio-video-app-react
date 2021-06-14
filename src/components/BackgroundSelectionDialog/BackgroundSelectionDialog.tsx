import React from 'react';
import BackgroundSelectionHeader from './BackgroundSelectionHeader/BackgroundSelectionHeader';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles, Theme } from '@material-ui/core/styles';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';

const useStyles = makeStyles((theme: Theme) => ({
  drawer: {
    display: 'flex',
    width: '20vw',
    height: `calc(100% - ${theme.footerHeight}px)`,
  },
}));

function BackgroundSelectionDialog() {
  const classes = useStyles();
  const { backgroundSelectionOpen, setBackgroundSelectionOpen } = useVideoContext();

  return (
    <Drawer
      variant="persistent"
      anchor="right"
      open={backgroundSelectionOpen}
      transitionDuration={0}
      classes={{
        paper: classes.drawer,
      }}
    >
      <BackgroundSelectionHeader onClose={() => setBackgroundSelectionOpen(false)} />
      {
        // TODO Implement background selection logic and front end
      }
    </Drawer>
  );
}

export default BackgroundSelectionDialog;
