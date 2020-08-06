import { useCallback, useEffect, useState } from 'react';
import Video from 'twilio-video';
import useMediaDevices from '../../../hooks/useMediaDevices/useMediaDevices';
import usePrevious from '../../../hooks/usePrevious/usePrevious';
import { useAppState } from '../../../state';

function isSameDevice(prevDefaultDevice: { deviceId: string; groupId: string; label: string; } | undefined, newDefaultDevice: { deviceId?: any; groupId?: any; label?: any; }) {
    if (!prevDefaultDevice) return false;
    return (
        prevDefaultDevice.deviceId === newDefaultDevice.deviceId &&
        prevDefaultDevice.groupId === newDefaultDevice.groupId &&
        prevDefaultDevice.label === newDefaultDevice.label
    );
}

export function useLocalAudioTrack() {
    const [track, setTrack] = useState<any>();
    const defaultDevice = useMediaDevices('audioinput') as any;
    const prevDefaultDevice = usePrevious(defaultDevice as unknown as undefined);
    const selectedAudioInputs = useAppState();

    useEffect(() => {
        if (!isSameDevice(prevDefaultDevice, defaultDevice )) {
            console.log('auto', defaultDevice.label);
        }
         //* eslint-disable-next-line  react-hooks/exhaustive-deps*/
    }, [defaultDevice]);
   
    useEffect(() => {
        console.log('manual', selectedAudioInputs.label);
    }, [selectedAudioInputs]);

    useEffect(() => {
        Video.createLocalAudioTrack({
            deviceId: defaultDevice.deviceId,
            groupId: defaultDevice.groupId,
        })
            .then((newTrack) => {
                setTrack(newTrack as any);
            })
            .catch(() => {
                console.log('No microphone attached.');
            });
    }, [defaultDevice]);

    useEffect(() => {
        Video.createLocalAudioTrack({
            deviceId: selectedAudioInputs.deviceId,
            groupId: selectedAudioInputs.groupId,
        })
            .then((newTrack: Video.LocalAudioTrack) => {
                setTrack(newTrack as any);
            })
            .catch(() => {
                console.log('No microphone attached.');
            });
    }, [selectedAudioInputs]);

    useEffect(() => {
        const handleStopped = () => setTrack(undefined);
        if (track) {
            track.on('stopped', handleStopped);
            return () => {
                track.off('stopped', handleStopped);
            };
        }
    }, [track]);

    return track;
}

export function useLocalVideoTrack() {
    const [track, setTrack] = useState<any>();

    const { selectedVideoInput } = useAppState();

    const getLocalVideoTrack = useCallback(
        () =>
            Video.createLocalVideoTrack({
                deviceId: selectedVideoInput.deviceId,
                groupId: selectedVideoInput.groupId,
                frameRate: 24,
                height: 720,
                width: 1280
            })
                .then((newTrack: any) => {
                    setTrack(newTrack);
                    return newTrack;
                })
                .catch((err) => {
                    if (err.message === 'Requested device not found') {
                        console.log('No camera attached.');
                    }
                }),
        [selectedVideoInput]
    );

    useEffect(() => {
        // We get a new local video track when the app loads.
        getLocalVideoTrack();
    }, [selectedVideoInput, getLocalVideoTrack]);

    useEffect(() => {
        console.log('manual', selectedVideoInput.label);
    }, [selectedVideoInput]);


    useEffect(() => {
        const handleStopped = () => setTrack(undefined);
        if (track) {
            track.on('stopped', handleStopped);
            return () => {
                track.off('stopped', handleStopped);
            };
        }
    }, [track]);

    return [track, getLocalVideoTrack];
}

export default function useLocalTracks() {
    const audioTrack = useLocalAudioTrack();
    const [videoTrack, getLocalVideoTrack] = useLocalVideoTrack();

    const localTracks = [audioTrack, videoTrack].filter(
        (track) => track !== undefined
    );

    return { localTracks, getLocalVideoTrack };
}
