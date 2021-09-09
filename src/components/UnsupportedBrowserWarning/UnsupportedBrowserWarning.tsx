import React from 'react';
import Video from 'twilio-video';
import { Container, Link, Typography, Paper, Grid, Box, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { isMobile, isIOS, isAndroid } from 'react-device-detect';

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

export default function UnsupportedBrowserWarning({ children }: { children: React.ReactElement }) {
  const classes = useStyles();

  if (!Video.isSupported) {
    return (
      <Container>
        <Grid container justifyContent="center" className={classes.container}>
          <Grid item xs={12} sm={6}>
            <Paper className={classes.paper}>
              <Typography variant="h4" className={classes.heading}>
                Browser or context not supported
              </Typography>
              <Typography>
                Please open this application in one of the{' '}
                <Link
                  href="https://www.twilio.com/docs/video/javascript#supported-browsers"
                  target="_blank"
                  rel="noopener"
                >
                  supported browsers
                </Link>
                .
                <br />
                If you are using a supported browser, please ensure that this app is served over a{' '}
                <Link
                  href="https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts"
                  target="_blank"
                  rel="noopener"
                >
                  secure context
                </Link>{' '}
                (e.g. https or localhost).
                <br />
                {isMobile && isAndroid && (
                  <Box>
                    <Typography style={{ paddingTop: 10 }}>You can use Chrome on this phone.</Typography>
                    <Box
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        paddingTop: '5%',
                      }}
                    >
                      <Button
                        size="large"
                        component="a"
                        color="secondary"
                        href={`intent://${window.location.host}${window.location.pathname}/#Intent;scheme=https;package=com.android.chrome;end`}
                        variant="contained"
                      >
                        Open in Chrome
                      </Button>
                    </Box>
                  </Box>
                )}
                {isMobile && isIOS && (
                  <Box>
                    <Typography style={{ paddingTop: 10 }}>You can use Safari on this phone.</Typography>
                    <Typography style={{ paddingTop: 10 }}>1.- Press button to copy URL</Typography>
                    <Box
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        paddingTop: '5%',
                      }}
                    >
                      <Button
                        size="large"
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          alert('Link copied');
                        }}
                        color="secondary"
                        variant="contained"
                      >
                        Copy Link
                      </Button>
                    </Box>
                    <Typography style={{ paddingTop: 10 }}>2.- Press button to open Safari</Typography>
                    <Box
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        paddingTop: '5%',
                      }}
                    >
                      <Button
                        size="large"
                        component="a"
                        color="secondary"
                        href={`x-web-search://?`}
                        variant="contained"
                      >
                        Open Safari
                      </Button>
                    </Box>
                    <Typography style={{ paddingTop: 10 }}>3.- Paste the link on Safari browser</Typography>
                  </Box>
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
