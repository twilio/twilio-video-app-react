import React, { FormEvent } from 'react';
import { Typography, makeStyles, Theme, Grid, Button } from '@material-ui/core';
import IntroContainer from '../../IntroContainer/IntroContainer';

const useStyles = makeStyles((theme: Theme) => ({
  gutterBottomSmall: {
    marginBottom: '0.5em',
  },
  gutterBottom: {
    marginBottom: '1em',
  },
  inputContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '1.5em 0 3.5em',
    '& div:not(:last-child)': {
      marginRight: '1em',
    },
    [theme.breakpoints.down('sm')]: {
      margin: '1.5em 0 2em',
    },
  },
  textFieldContainer: {
    width: '100%',
  },
  continueButton: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  hidden: {
    display: 'none',
  },
}));

export default function ThankYouScreen() {
  const classes = useStyles();
  const URLFrom = sessionStorage.getItem('URLFrom');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (URLFrom) {
      if (URLFrom !== 'iframe') {
        window.open(`${URLFrom}://`, '_system');
      }
    }
  };

  return (
    <IntroContainer>
      <Typography variant="h5" className={classes.gutterBottomSmall}>
        Obrigado!
      </Typography>
      <Typography variant="body1" className={classes.gutterBottom}>
        Sua chamada de vídeo foi finalizada, retorne ao app para continuar.
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container justify="flex-start">
          <Button
            variant="contained"
            type="submit"
            color="primary"
            className={!URLFrom || URLFrom === 'iframe' ? classes.hidden : classes.continueButton}
          >
            Retornar para o App
          </Button>
        </Grid>
      </form>
    </IntroContainer>
  );
}
