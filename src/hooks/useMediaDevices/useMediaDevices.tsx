import { useEffect, useState, SetStateAction } from 'react';
import _ from 'lodash';

export default function useMediaDevices(kind: string){
    const [defaultDevice, setDefaultDevice] = useState<any>({});

    const [devices, setDevices] = useState( []);

    const updateDevices = _.debounce(() => {
        navigator.mediaDevices.enumerateDevices().then((allDevices) => {
            const devices = allDevices.filter((d) => d.kind === kind);
            setDevices(devices as never);
            const dDevice = devices.find((d) => d.deviceId === 'default');
            if (dDevice) {
                const actualDefaultDevice = devices.find(
                    (d) => d.groupId === dDevice.groupId && d.deviceId !== 'default'
                );
                if (actualDefaultDevice) {
                    setDefaultDevice(actualDefaultDevice);
                } else {
                    setDefaultDevice(dDevice);
                }
            } else if (devices.length > 0) {
                setDefaultDevice(devices[0]);
            } else {
                setDefaultDevice(null );
            }
        });
    }, 1000);

    useEffect(() => {
        updateDevices();
        navigator.mediaDevices.addEventListener('devicechange', updateDevices);
        return () => {
            navigator.mediaDevices.removeEventListener('devicechange', updateDevices);
        };
        //* eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { devices, defaultDevice };
}
