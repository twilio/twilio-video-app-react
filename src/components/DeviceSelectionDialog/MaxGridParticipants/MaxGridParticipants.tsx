import React from 'react';
import { FormControl, MenuItem, Typography, Select, Grid } from '@material-ui/core';
import { useAppState } from '../../../state';

const MAX_PARTICIPANT_OPTIONS = [4, 9, 16, 25];

export default function MaxGridParticipants() {
  const { maxGridParticipants, setMaxGridParticipants } = useAppState();

  return (
    <div>
      <Typography variant="subtitle2" gutterBottom>
        Max Grid Participants
      </Typography>
      <Grid container alignItems="center" justifyContent="space-between">
        <div className="inputSelect">
          <FormControl fullWidth>
            <Select
              onChange={e => setMaxGridParticipants(parseInt(e.target.value as string))}
              value={maxGridParticipants}
              variant="outlined"
            >
              {MAX_PARTICIPANT_OPTIONS.map(option => (
                <MenuItem value={option} key={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </Grid>
    </div>
  );
}
