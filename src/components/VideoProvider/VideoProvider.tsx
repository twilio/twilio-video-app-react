import React, { createContext } from 'react';

import { SelectedParticipantProvider } from './useSelectedParticipant/useSelectedParticipant';
import useHandleRoomDisconnectionErrors from './useHandleRoomDisconnectionErrors/useHandleRoomDisconnectionErrors';
import useHandleOnDisconnect from './useHandleOnDisconnect/useHandleOnDisconnect';
import useHandleTrackPublicationFailed from './useHandleTrackPublicationFailed/useHandleTrackPublicationFailed';
import useLocalTracks from './useLocalTracks/useLocalTracks';
import useRoom from './useRoom/useRoom';

export const VideoContext = createContext<any>(!null);

export function VideoProvider({
    options,
    children,
    onError = () => { },
    onDisconnect = () => { },
}) {
    const onErrorCallback = (error) => {
        console.log(`ERROR: ${error.message}`, error);
        onError();
    };

    const { localTracks, getLocalVideoTrack } = useLocalTracks();
    const { room, isConnecting, connect } = useRoom(
        localTracks,
        onErrorCallback,
        options
    );

    // Register onError and onDisconnect callback functions.
    useHandleRoomDisconnectionErrors(room, onError);
    useHandleTrackPublicationFailed(room, onError);
    useHandleOnDisconnect(room, onDisconnect);

    return (
        <VideoContext.Provider
            value={{
                room,
                localTracks,
                isConnecting,
                onError: onErrorCallback,
                onDisconnect,
                getLocalVideoTrack,
                connect,
            }}
        >
            <SelectedParticipantProvider room={room}>
                {children}
            </SelectedParticipantProvider>
        </VideoContext.Provider>
    );
}
