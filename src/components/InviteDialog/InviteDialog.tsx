import React, { ChangeEvent, FormEvent, PropsWithChildren, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';

import { useAppState } from '../../state';
import { Grid, InputLabel, makeStyles, TextField, Theme } from '@material-ui/core';
import { getThirdPartyURL } from '../Room/RoomUtils';
import DialogContentText from '@material-ui/core/DialogContentText';

const useStyles = makeStyles((theme: Theme) => ({
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
      flexDirection: 'column',
      margin: '0em 0 0em',
    },
  },
  textFieldContainer: {
    width: '100%',
    margin: '.2em .2em 1em',
  },
  inviteButton: {
    margin: '.2em',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  inviteMessage: {
    color: 'black',
  },
}));

interface InviteDialogProps {
  open: boolean;
  onClose(): void;
}

function InviteDialog({ open, onClose }: PropsWithChildren<InviteDialogProps>) {
  const { roomType } = useAppState();
  const [partyName, setPartyName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const classes = useStyles();
  const [inviteMessage, setInviteMessage] = useState<string>('Please use +14085551234 format for the phone number');

  const handlePartyNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPartyName(event.target.value);
  };
  const handlePhoneNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(event.target.value);
  };

  const onLocalClose = () => {
    setPartyName('');
    setPhoneNumber('');
    setInviteMessage('Please use +14085551234 format for the phone number');
    onClose();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    //alert(getThirdPartyURL().toString());
    setInviteMessage('Sending invitation...');
    fetch('/send-third-party-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phoneNumber,
        patient: 'patient',
        visitUrl: getThirdPartyURL(partyName),
      }),
    })
      .then(res => {
        if (!res.ok) setInviteMessage('Invitation could not be sent.');
        else setInviteMessage(`Your invitation has been sent to ${partyName}.`);
      })
      .catch(err => {
        // for running locally
        setInviteMessage('Invitation could not be sent.');
      });
    // If this app is deployed as a twilio function, don't change the URL because routing isn't supported.
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="xs">
      <DialogActions></DialogActions>
      <DialogTitle>Invite someone to join the call</DialogTitle>
      <Divider />
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <div className={classes.inputContainer}>
            <div className={classes.textFieldContainer}>
              <InputLabel shrink htmlFor="input-party-name">
                Name
              </InputLabel>
              <TextField
                id="input-parrty-name"
                variant="outlined"
                fullWidth
                size="small"
                value={partyName}
                onChange={handlePartyNameChange}
              />
            </div>

            <div className={classes.textFieldContainer}>
              <InputLabel shrink htmlFor="input-phone-number">
                Phone&nbsp;Number
              </InputLabel>
              <TextField
                autoCapitalize="false"
                id="input-phone-number"
                variant="outlined"
                fullWidth
                size="small"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
              />
            </div>
          </div>
          <DialogContentText className={classes.inviteMessage}>{inviteMessage}</DialogContentText>
          <Grid container justifyContent="flex-end">
            <Button
              variant="contained"
              type="submit"
              color="primary"
              disabled={!partyName || !phoneNumber}
              className={classes.inviteButton}
            >
              Invite
            </Button>
            <Button className={classes.inviteButton} onClick={onLocalClose} variant="contained" autoFocus>
              Close
            </Button>
          </Grid>
        </form>
      </DialogContent>
      <Divider />
    </Dialog>
  );
}

export default InviteDialog;
