import React from 'react';
import { styled } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import useParticipants from '../../hooks/useParticipants/useParticipants';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import useSelectedParticipant from '../VideoProvider/useSelectedParticipant/useSelectedParticipant';

import Participant from '../Participant/Participant';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

const Container = styled('aside')(({ theme }) => ({
    padding: '0.5em',
    overflowY: 'auto',
    [theme.breakpoints.down('xs')]: {
        overflowY: 'initial',
        overflowX: 'auto',
        padding: 0,
        display: 'flex',
    },
}));

const ScrollContainer = styled('div')(({ theme }) => ({
    [theme.breakpoints.down('xs')]: {
        display: 'flex',
    },
}));

export default function ParticipantStrip(gridView: any) {
    const {
        room: { localParticipant },
    } = useVideoContext();
    const participants = useParticipants();
    const [
        selectedParticipant,
        setSelectedParticipant,
    ] = useSelectedParticipant();

    const classes = useStyles();

    return gridView ? (
        <div className={classes.root}>
            <Grid container spacing={1}>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <Paper className={classes.paper}>
                        <Participant
                            gridView={gridView}
                            participant={localParticipant}
                            isSelected={selectedParticipant === localParticipant}
                            onClick={() => setSelectedParticipant(localParticipant)}
                        />
                    </Paper>
                </Grid>
                {participants.map((participant: any) => (
                    <Grid key={participant.sid} item xs={4} sm={4} md={4} lg={4}>
                        <Paper className={classes.paper}>
                            <Participant
                                gridView={gridView}
                                key={participant.sid}
                                participant={participant}
                                isSelected={selectedParticipant === participant}
                                onClick={() => setSelectedParticipant(participant)}
                            />
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </div>
    ) : (
            <Container>
                <ScrollContainer>
                    <Participant
                        gridView={gridView}
                        participant={localParticipant}
                        isSelected={selectedParticipant === localParticipant}
                        onClick={() => setSelectedParticipant(localParticipant)}
                    />
                    {participants.map((participant: any) => (
                        <Participant
                            gridView={gridView}
                            key={participant.sid}
                            participant={participant}
                            isSelected={selectedParticipant === participant}
                            onClick={() => setSelectedParticipant(participant)}
                        />
                    ))}
                </ScrollContainer>
            </Container>
        );
}
