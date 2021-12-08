import React, { ChangeEvent, FormEvent } from 'react';
import { Typography, makeStyles, Theme } from '@material-ui/core';
import { useAppState } from '../../../state';
import useLanguageContext from 'hooks/useLanguageContext';
import { LANGUAGE_CODE } from 'types/Language';

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
}));

interface RoomNameScreenProps {
  name: string;
  setName: (name: string) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function RoomNameScreen({ setName, handleSubmit, name }: RoomNameScreenProps) {
  const classes = useStyles();
  const { user } = useAppState();
  const { langCode } = useLanguageContext();

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const hasUsername = !window.location.search.includes('customIdentity=true') && user?.displayName;

  return (
    <>
      <Typography variant="h5" className={classes.gutterBottom}>
        {`${langCode === LANGUAGE_CODE.de_DE ? 'DemokraTisch beitreten' : 'Join DemokraTisch'}`}
      </Typography>
      <form onSubmit={handleSubmit}>
        <div className={classes.inputContainer}>
          {!hasUsername && (
            <div className={classes.textFieldContainer}>
              <input
                id="input-user-name"
                onChange={handleNameChange}
                className="rounded-full border border-gray-500 px-3 py-1"
                placeholder="Dein Name"
                required
                maxLength={30}
                defaultValue={name}
              />
            </div>
          )}
        </div>
        <div className="flex text-purple hover:underline justify-center">
          <button type="submit" className="font-medium">
            {`${langCode === LANGUAGE_CODE.de_DE ? 'Weiter' : 'Next'}`}
          </button>
        </div>
      </form>
    </>
  );
}
