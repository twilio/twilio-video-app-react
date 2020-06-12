import React from 'react';
import Video from 'twilio-video';
import { Container, Link, Typography, Paper, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  container: {
    marginTop: '2.5em',
  },
  paper: {
    padding: '1em',
  },
  heading: {
    marginBottom: '0.4em',
  },
});

export default function({ children }: { children: React.ReactElement }) {
  const classes = useStyles();

  if (!Video.isSupported) {
    return (
      <Container>
        <Grid container justify="center" className={classes.container}>
          <Grid item xs={12} sm={6}>
            <Paper className={classes.paper}>
              <Typography variant="h4" className={classes.heading}>
                Browser not supported
              </Typography>
              <Typography>
                This is not a supported browser. Please refer to our list of{' '}
                <Link
                  href="https://www.twilio.com/docs/video/javascript#supported-browsers"
                  target="_blank"
                  rel="noopener"
                >
                  supported browsers
                </Link>
                .
                <br />
                {!window.isSecureContext && (
                  <>
                    If you are using a browser on the supported browser list, please ensure that this app is served over
                    a secure context. This app must be served over a secure context (e.g. https or localhost). Please
                    see:{' '}
                    <Link
                      href="https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts"
                      target="_blank"
                      rel="noopener"
                    >
                      https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts
                    </Link>
                    .
                  </>
                )}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  }

  return children;
}
