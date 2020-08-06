import React, { useState, useEffect } from 'react';
import { ValueType, OptionType } from 'react-select';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem
}
from '@material-ui/core';

import { makeStyles, Theme } from '@material-ui/core/styles';

import SettingsIcon from '@material-ui/icons/Settings';

import useMediaDevices from '../../../hooks/useMediaDevices/useMediaDevices';
import { useAppState } from '../../../state';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        '& .MuiFormControl-root': {
            marginBottom: '20px',
            width: '100%'
        }
    },
}));
export default function SettingsButton(selectedAudioDevice: any, selectedVideoDevice: any) {

    const classes = useStyles();

    const [open, setOpen] = useState(false);
    const {
        setSelectedAudioInput,
        setSelectedVideoInput,
        selectedSpeakerOutput,
        setSelectedSpeakerOutput
    } = useAppState();

    const [selectedMic, setSelectedMic] = useState(selectedAudioDevice);
    const [selectedCamera, setSelectedCamera] = useState(selectedVideoDevice);
    const [selectedSpeaker, setSelectedSpeaker] = useState(selectedSpeakerOutput);

    useEffect(() => {
        setSelectedMic(selectedAudioDevice)
    }, [selectedAudioDevice]);

    useEffect(() => {
        setSelectedCamera(selectedVideoDevice)
    }, [selectedVideoDevice]);

    useEffect(() => {
        setSelectedSpeaker(selectedSpeaker)
    }, [selectedSpeaker]);

    const {
        devices: audioinputs
    } = useMediaDevices('audioinput');

    const {
        devices: videoinputs
    } = useMediaDevices('videoinput');

    const {
        devices: audiooutput
    } = useMediaDevices('audiooutput');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = () => {
        if (selectedAudioDevice !== selectedMic) {
            setSelectedAudioInput(selectedMic);
        }
        if (selectedVideoDevice !== selectedCamera) {
            setSelectedVideoInput(selectedCamera);
        }
        if (selectedSpeaker && selectedSpeaker.deviceId) {
            if (selectedSpeakerOutput && selectedSpeakerOutput.deviceId !== selectedSpeaker.deviceId) {
                setSelectedSpeakerOutput(selectedSpeaker);
            }
        }
        setOpen(false);
    }

    const handleAudioInputChange = (target: ValueType<OptionType>) => {
        const selectedDeviceInfo = audioinputs.find((x: { deviceId: any; }) => x.deviceId === x.deviceId === target.value);
        setSelectedMic(selectedDeviceInfo);
    }

    const handleVideoInputChange = (target: ValueType<OptionType>) => {
        const selectedDeviceInfo = videoinputs.find((x: { deviceId: any; }) => x.deviceId === target.value);
        setSelectedCamera(selectedDeviceInfo);
    }

    const handleSpeakerInputChange = (target: ValueType<OptionType>) => {
        const selectedDeviceInfo = audiooutput.find((x: { deviceId: any; }) => x.deviceId === target.value);
        setSelectedSpeaker(selectedDeviceInfo);
    }

    return (
        <>
            <IconButton onClick={handleClickOpen}>
                <SettingsIcon />
            </IconButton>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
                className={classes.root}
                fullWidth={true}
                maxWidth={'sm'}
            >
                <DialogTitle id="form-dialog-title">Settings</DialogTitle>
                <DialogContent>
                    <FormControl>
                        <InputLabel htmlFor="microphone">Microphone</InputLabel>
                        <Select
                            id="microphone"
                            label="Microphone"
                            value={selectedMic.deviceId}
                            margin="dense"
                            placeholder="Microphone"
                            onChange={handleAudioInputChange}
                        >
                            {audioinputs.filter((x: { deviceId: string; }) => x.deviceId !== 'default').map((input: any) => (
                                <MenuItem key={input.deviceId} value={input.deviceId} >
                                    {input.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel htmlFor="camera">Camera</InputLabel>
                        <Select
                            id="camera"
                            label="Camera"
                            value={selectedCamera.deviceId}
                            margin="dense"
                            placeholder="Camera"
                            onChange={handleVideoInputChange}
                        >
                            {videoinputs.filter((x: { deviceId: string; }) => x.deviceId !== 'default').map((input: any) => (
                                <MenuItem key={input.deviceId} value={input.deviceId} >
                                    {input.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel htmlFor="speaker">Speaker</InputLabel>
                        <Select
                            id="speaker"
                            label="Speaker"
                            value={selectedSpeaker.deviceId}
                            margin="dense"
                            placeholder="Speaker"
                            onChange={handleSpeakerInputChange}
                        >
                            {audiooutput.filter((x: { deviceId: string; }) => x.deviceId !== 'default').map((input: any) => (
                                <MenuItem key={input.deviceId} value={input.deviceId} >
                                    {input.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
          </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Submit
          </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
