import React, { useState, useEffect, useCallback } from 'react'
import { Text, TouchableOpacity, ViewStyle } from 'react-native'
import {
  Box,
  Select,
  IndexPath,
  luxColors,
  Icon,
  Iffy,
} from '@alucio/lux-ui'

import {
  LocalVideoPreview,
  LocalAudioLevelIndicator,
  useVideoContext,
  useAppState,
  useAudioInputDevices,
  useAudioOutputDevices,
  useVideoInputDevices,
} from '../../main'

export type deviceType = 'audioinput' | 'audiooutput' | 'videoinput'

const S = {
  Container: {
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'flex-start',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: luxColors.contentPanelBackground.tertiary,
    backgroundColor: luxColors.contentPanelBackground.primary,

  },
  Title: {
    Container: {
      paddingTop: 16,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderStyle: 'solid',
      borderColor: luxColors.contentPanelBackground.tertiary,
    },
    Text: {
      color: luxColors.info.primary,
      fontSize: 16,
      marginLeft: 16,
    },
  },
  Options: {
    Container: {
      padding: 24,
    },
    Device: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      marginBottom: 32,
      minWidth: 324,
    } as ViewStyle,
    Select: {
      paddingRight: 24,
      width: 324,
    },
    Icon: {
      width: 24,
      height: 24,
      color: luxColors.info.primary,
    },
    IconActive: {
      color: luxColors.mediaDevice.primary,
    },
    VideoPreview: {
      width: 112,
    },
  },
  Button: {
    Base: {
      backgroundColor: luxColors.thumbnailBorder.primary,
    },
    Round: {
      padding: 8,
      borderRadius: 200,
    },
    Confirm: {
      borderRadius: 200,
      alignSelf: 'flex-end',
      minHeight: 0,
      marginTop: 12,
      paddingTop: 8,
      paddingBottom: 8,
      paddingLeft: 12,
      paddingRight: 12,
    } as ViewStyle,
  },
}

const useAudioOutputTest = (audioFiles: any[]) => {
  const { activeSinkId } = useAppState();
  const [audioEl, setAudioEl] = useState<HTMLAudioElement>();
  const [soundIdx, setSoundIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  const playAudio = useCallback(() => {
    if (!isPlaying) {
      setIsPlaying(true)
      audioEl?.play()
    }
  }, [audioFiles, soundIdx, audioEl, isPlaying])

  useEffect(() => {
    if (!audioEl) {
      const newAudioEl = new Audio(audioFiles[soundIdx])
      newAudioEl.addEventListener('ended', () => {
        setSoundIdx(p => p < audioFiles.length - 1 ? p + 1 : 0)
        setIsPlaying(false)
      })
      newAudioEl.setSinkId?.(activeSinkId)
      document.body.appendChild(newAudioEl);
      setAudioEl(newAudioEl)
    } else {
      audioEl.src = audioFiles[soundIdx]
    }

    return () => audioEl?.remove()
  }, [audioFiles, soundIdx]);

  useEffect(() => {
    audioEl?.setSinkId?.(activeSinkId);
  }, [activeSinkId]);

  return { playAudio, isPlaying };
}

const useDeviceSelect = (deviceType: deviceType) => {
  const {
    room: { localParticipant },
    localTracks,
    getLocalAudioTrack,
    getLocalVideoTrack,
  } = useVideoContext()
  const { activeSinkId, setActiveSinkId } = useAppState()
  const audioOutputDevices = useAudioOutputDevices()
  const audioInputDevices = useAudioInputDevices()
  const videoInputDevices = useVideoInputDevices()

  const [idx, setIdx] = useState<IndexPath>(new IndexPath(-1))
  const [deviceAborted, setDeviceAborted] = useState<string|undefined>()

  const devices = {
    audioinput: audioInputDevices,
    audiooutput: audioOutputDevices,
    videoinput: videoInputDevices,
  }[deviceType]

  const getLocalTrackByType = {
    audio: (newDeviceId: string) => getLocalAudioTrack(newDeviceId),
    video: (newDeviceId: string) => getLocalVideoTrack({ deviceId: { exact: newDeviceId } }),
  }

  const trackType = deviceType === 'audioinput' ? 'audio' : 'video'
  const localTrack = localTracks.find(track => track.kind === trackType)
  const localTrackLabel = localTrack?.mediaStreamTrack?.label
  const isAudioOutput = deviceType === 'audiooutput'
  const deviceLabel = devices?.[idx.row]?.label ?? (isAudioOutput ? 'System Default Audio Output' : ' ')

  function unpublishTrack() {
    localTrack?.stop()

    if (localTrack) {
      const localTrackPublication = localParticipant?.unpublishTrack(localTrack)
      localParticipant?.emit('trackUnpublished', localTrackPublication)
    }
  }

  async function replaceTrack(newDevice: MediaDeviceInfo) {
    unpublishTrack()

    const newTrack = await getLocalTrackByType[trackType](newDevice.deviceId)
    localParticipant?.publishTrack(newTrack)
  }

  // Set the selected device
  useEffect(() => {
    const isLocalTrackDeviceConnected = !isAudioOutput
      ? devices.find(device => device.label === localTrackLabel)
      : devices.find(device => device.deviceId === activeSinkId)
    const isDeviceUnset = idx.row === -1

    // If localtrack doesn't match any devices, but was previously set
    //  (device was abruptly disconnected/aborted)
    if (!isLocalTrackDeviceConnected && !isDeviceUnset) {
      if (!isAudioOutput) {
        unpublishTrack()
        console.log('device aborted', localTrackLabel)
        setDeviceAborted(localTrackLabel)
      }
      setIdx(new IndexPath(-1))
    }
    // If localtrack doesn't match any devices (or no devices), flag as unset
    else if (!isLocalTrackDeviceConnected && isDeviceUnset)
    { setIdx(new IndexPath(-1)) }
    // If localtrack matches a device or aborted device is reconnected, flag as device
    else if (isLocalTrackDeviceConnected) {
      const deviceIdx = !isAudioOutput
        ? devices.findIndex(device => device.label === localTrackLabel)
        : devices.findIndex(device => device.deviceId === activeSinkId)

      setIdx(new IndexPath(deviceIdx))
    }
  }, [devices.length, localTracks.length])

  // Replace track on select list change (via user input or via above useEffect)
  useEffect(() => {
    const nextDevice = devices?.[idx.row]
    const nextDeviceLabel = nextDevice?.label
    const isDifferentDevice = (localTrackLabel && nextDeviceLabel) &&
      (localTrackLabel !== nextDeviceLabel)
    const isResumingAbortedDevice = (deviceAborted && nextDeviceLabel) &&
      (deviceAborted === nextDeviceLabel)

    if (!nextDevice) return;

    if (isAudioOutput) {
      setActiveSinkId(nextDevice.deviceId)
      return;
    }

    if (isDifferentDevice || isResumingAbortedDevice) {
      replaceTrack(nextDevice)
      setDeviceAborted(undefined)
    }
  }, [idx])

  return {
    idx,
    setIdx: (index: IndexPath | IndexPath[]) => {
      // Circumvents TS fn signature
      if (!Array.isArray(index))
      { setIdx(index) }
    },
    devices,
    deviceLabel,
  }
}

const DeviceSelect: React.FC<{ label: string, deviceType: deviceType }> = (props) => {
  const { label, deviceType, children } = props
  const { idx, setIdx, devices, deviceLabel } = useDeviceSelect(deviceType)

  return (
    <Box style={[S.Options.Device]}>
      <Select
        value={deviceLabel}
        label={label}
        selectedIndex={idx}
        onSelect={setIdx}
        style={S.Options.Select}
        status="dark"
      >
        {
          devices.map((device) => (
            <Select.Item
              key={device.deviceId}
              title={device.label}
            />
          ))
        }
      </Select>
      { children }
    </Box>
  );
}

const AudioTestButton: React.FC<{ audioFiles: any[]}> = (props) => {
  const { audioFiles } = props
  const { playAudio, isPlaying } = useAudioOutputTest(audioFiles)

  return (
    <Box>
      <TouchableOpacity
        style={[S.Button.Base, S.Button.Round]}
        onPress={playAudio}
        activeOpacity={1}
      >
        <Icon
          name={`volume-${isPlaying ? 'high' : 'medium'}`}
          style={[S.Options.Icon]}
        />
      </TouchableOpacity>
    </Box>
  )
}

const DeviceSettings: React.FC<{
  onDone?: () => void,
  audioFiles: any[],
  disableLocalAudio?: boolean
}> = (props) => {
  const { onDone, audioFiles, disableLocalAudio } = props

  return (
    <Box style={[S.Container]}>
      <Box style={[S.Title.Container]}>
        <Text style={[S.Title.Text]}>Audio & Video</Text>
      </Box>
      <Box style={[S.Options.Container]}>

        <Iffy is={!disableLocalAudio}>
          <DeviceSelect label="MICROPHONE" deviceType="audioinput">
            <Box style={{ padding: 6 }}>
              <LocalAudioLevelIndicator />
            </Box>
          </DeviceSelect>

          <DeviceSelect label="SPEAKERS" deviceType="audiooutput">
            <AudioTestButton audioFiles={audioFiles} />
          </DeviceSelect>
        </Iffy>

        <DeviceSelect label="VIDEO" deviceType="videoinput">
          <Box style={S.Options.VideoPreview}>
            <LocalVideoPreview />
          </Box>
        </DeviceSelect>

        <TouchableOpacity
          activeOpacity={1}
          style={[S.Button.Base, S.Button.Confirm]}
          onPress={onDone}
        >
          <Text style={{ color: 'white' }}>Done</Text>
        </TouchableOpacity>
      </Box>

    </Box>
  )
}

export default DeviceSettings
