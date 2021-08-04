import React from 'react';
import Video from 'twilio-video';
import { Container, Typography, Paper, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { isMobile, mobileOperatingSystem } from '../../utils/'
import { useAppState } from '../../state';
import updateParticipant from '../../utils/ParticipantStatus/updateParticipant'
import redirectRootPath from '../../utils/redirectRootPath'

const useStyles = makeStyles({
  container: {
    marginTop: '2.5em',
  },
  paper: {
    padding: '1em',
  },
  heading: {
    marginBottom: '20px',
    textAlign: 'center',
  },
  joinButton: {
    marginLeft: '43%',
  },
});

const browserErrorMessage = () => {
  if (isMobile) {
    if (mobileOperatingSystem() === 'iOS')
      return 'Para iOS puedes usar versiones recientes de SAFARI'
    else if (mobileOperatingSystem() === 'Android')
      return 'Para Android puedes usar versiones recientes de Chrome o Firefox'
    else
      return "Navegador no soportado"
  }
  else
    return 'Puedes usar versiones recientes de Chrome, Firefox o Safari.'
}

const handleClick = () => {
  return function () {
    redirectRootPath();
  }
};

export default function UnsupportedBrowserWarning({ children }: { children: React.ReactElement }) {
  const classes = useStyles();
  const message = browserErrorMessage();
  const { appointmentID, user } = useAppState();
  if (!Video.isSupported) {
    updateParticipant(appointmentID, user.participantID, 'failed', { name: 'BrowserNotSupported', message: 'Browser not supported' });
    return (
      <Container>
        <Grid container justifyContent="center" className={classes.container}>
          <Grid item xs={12} sm={6}>
            <Paper className={classes.paper}>
              <Typography variant="h4" className={classes.heading}>
                Navegador no soportado
              </Typography>
              <Typography className={classes.heading}>
                {message}
              </Typography>
              <Button
                className={classes.joinButton}
                type="button"
                color="primary"
                variant="contained"
                onClick={handleClick()}
              >
                Volver
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  }

  return children;
}
