/* eslint-disable no-undefined */
/* eslint-disable require-atomic-updates */
/* eslint-disable no-console */
/* eslint-disable quotes */

import { Waveform } from './waveform.js';

function createElement(container, { type, id, classNames }) {
  const el = document.createElement(type);
  if (id) {
    el.id = id;
  }
  if (classNames) {
    el.classList.add(...classNames);
  }

  container.appendChild(el);
  return el;
}

function createDiv(container, divClass, id) {
  divClass = Array.isArray(divClass) ? divClass : [divClass];
  return createElement(container, { type: 'div', classNames: divClass, id });
}

function getChildDiv(container, divClass) {
  return container.querySelector('.' + divClass) || createDiv(container, divClass);
}

function createButton(text, container, onClick) {
  const btn = createElement(container, { type: 'button', classNames: ['btn', 'btn-outline-primary', 'btn-sm'] });
  btn.innerHTML = text;
  btn.onclick = onClick;
  return {
    btn,
    show: visible => {
      btn.style.display = visible ? 'inline-block' : 'none';
    },
    text: newText => {
      btn.innerHTML = newText;
    },
    click: () => onClick(),
  };
}

function createLabeledCheckbox(container, labelText, id) {
  const checkbox = createElement(container, { type: 'input', id });
  checkbox.setAttribute('type', 'checkbox');

  const label = createElement(container, { type: 'label' });
  label.innerHTML = labelText;
  label.setAttribute('for', id);
  return checkbox;
}

export function demo(Video, containerDiv) {
  // create html
  const mainDiv = createDiv(containerDiv, 'main', 'main');
  const logDiv = createDiv(containerDiv, 'outerLog', 'log');
  const twilioVideoVersion = createElement(mainDiv, { type: 'h1', id: 'twilioVideoVersion' });
  const localControls = createDiv(mainDiv, 'localControls', 'localControls');
  const localAudioTrackContainer = createDiv(localControls, 'audioTrackContainer', 'audioTrack');
  const localVideoTrackContainer = createDiv(localControls, 'videoTrackContainer', 'videoTrack');
  const btnPreviewAudio = createElement(localAudioTrackContainer, {
    type: 'button',
    id: 'button-preview-audio',
    classNames: ['btn', 'btn-primary', 'btn-block'],
  });
  btnPreviewAudio.innerHTML = 'Audio';

  const btnPreviewVideo = createElement(localVideoTrackContainer, {
    type: 'button',
    id: 'button-preview-video',
    classNames: ['btn', 'btn-primary', 'btn-block'],
  });
  btnPreviewVideo.innerHTML = 'Video';

  const roomControlsDiv = createDiv(localControls, 'room-controls', 'room-controls');
  const roomSid = createElement(roomControlsDiv, { type: 'h2', id: 'roomSid' });
  const localIdentity = createElement(roomControlsDiv, { type: 'h2', id: 'localIdentity' });
  const roomNameInput = createElement(roomControlsDiv, { type: 'input', id: 'room-name' });
  roomNameInput.placeholder = 'Enter room name';

  const controlOptionsDiv = createDiv(roomControlsDiv, 'control-options', 'control-options');

  const autoPublish = createLabeledCheckbox(controlOptionsDiv, 'Auto Publish', 'autoPublish');
  const autoAttach = createLabeledCheckbox(controlOptionsDiv, 'Auto Attach', 'autoAttach');
  const autoJoin = createLabeledCheckbox(controlOptionsDiv, 'Auto Join', 'autoJoin');

  const btnJoin = createElement(roomControlsDiv, {
    type: 'button',
    id: 'button-join',
    classNames: ['btn', 'btn-primary', 'btn-block'],
  });
  btnJoin.innerHTML = 'Join';
  const btnLeave = createElement(roomControlsDiv, {
    type: 'button',
    id: 'button-leave',
    classNames: ['btn', 'btn-primary', 'btn-block'],
  });
  btnLeave.innerHTML = 'Leave';

  const remoteParticipantsContainer = createDiv(mainDiv, 'remote-participants', 'remote-participants');
  twilioVideoVersion.innerHTML = 'Twilio-Video@' + Video.version;

  // process parameters.
  const { protocol, host, pathname } = window.location;
  console.log({ protocol, host, pathname });
  var urlParams = new URLSearchParams(window.location.search);
  let token = urlParams.get('token') || `${protocol}//${host}/token`;
  let tokenUrl = null;

  if (token.indexOf('http') >= 0) {
    tokenUrl = token;
    token = null;
  } else if (token === 'default') {
    tokenUrl = `${protocol}//${host}/token`;
    token = null;
  } else if (token === 'local') {
    tokenUrl = 'http://localhost:3000/token';
    token = null;
  } else {
    // if real token is part of the url delete it.
    urlParams.delete('token');
    window.history.replaceState(null, '', window.encodeURI(`${protocol}//${host}${pathname}?${urlParams}`));
  }

  roomNameInput.value = urlParams.get('room');
  autoAttach.checked = !urlParams.has('noAutoAttach');
  autoPublish.checked = !urlParams.has('noAutoPublish');
  autoJoin.checked = urlParams.has('room') && urlParams.has('autoJoin');

  var activeRoom;
  const localTracks = [];

  let logClearBtn = null;
  let realLogDiv = null;
  function log(...args) {
    if (!logClearBtn) {
      logClearBtn = createButton('clear log', logDiv, () => {
        realLogDiv.innerHTML = '';
      });
      realLogDiv = createDiv(logDiv, 'log');
    }

    console.log(args);
    const message = [...args].reduce((acc, arg) => acc + ', ' + arg, '');
    // message = (new Date()).toISOString() + ':' + message;
    realLogDiv.innerHTML += '<p>&gt;&nbsp;' + message + '</p>';
    realLogDiv.scrollTop = realLogDiv.scrollHeight;
  }

  /**
   * Get the Room credentials from the server.
   * @param {string} [identity] identity to use, if not specified server generates random one.
   * @returns {Promise<{identity: string, token: string}>}
   */
  async function getRoomCredentials(tokenUrl) {
    const response = await fetch(tokenUrl); // /?tokenUrl=http://localhost:3000/token
    return response.json();
  }

  const roomChangeCallbacks = [];
  class RoomChanged {
    register(callback) {
      roomChangeCallbacks.push(callback);
      callback(activeRoom);
    }

    unregister(callback) {
      var index = roomChangeCallbacks.indexOf(callback);
      if (index > -1) {
        roomChangeCallbacks.splice(index, 1);
      }
    }

    emitRoomChange(room) {
      window.room = activeRoom = room;
      roomChangeCallbacks.forEach(callback => callback(room));
    }

    get room() {
      return activeRoom;
    }
  }

  const roomChangeMonitor = new RoomChanged();

  /**
   * Attach the AudioTrack to the HTMLAudioElement and start the Waveform.
   */
  function attachAudioTrack(track, container) {
    var audioElement = container.appendChild(track.attach());
    const waveform = new Waveform();
    waveform.setStream(audioElement.srcObject);
    const canvasContainer = createDiv(container, 'canvasContainer');
    canvasContainer.appendChild(waveform.element);
    return audioElement;
  }

  // styleMap uses the values to decide the style.
  function createLabeledStat(container, label, { id, className, useValueToStyle = false }) {
    const el = createElement(container, { type: 'p', id, classNames: [className, 'labeledStat'] });
    let lastText = null;
    return {
      setText: text => {
        if (useValueToStyle && lastText !== null) {
          el.classList.remove(`${className}_${lastText}`);
        }
        el.textContent = label + ': ' + text;
        if (useValueToStyle) {
          el.classList.add(`${className}_${text}`);
          lastText = text;
        }
      },
    };
  }

  function createTrackStats(track, container) {
    var statsContainer = createDiv(container, 'trackStats');

    const readyState = createLabeledStat(statsContainer, 'mediaStreamTrack.readyState', {
      className: 'readyState',
      useValueToStyle: true,
    });
    const enabled = createLabeledStat(statsContainer, 'mediaStreamTrack.enabled', {
      className: 'enabled',
      useValueToStyle: true,
    });
    const muted = createLabeledStat(statsContainer, 'mediaStreamTrack.muted', {
      className: 'muted',
      useValueToStyle: true,
    });
    const started = createLabeledStat(statsContainer, 'Track.started', { className: 'started', useValueToStyle: true });
    const trackEnabled = createLabeledStat(statsContainer, 'Track.enabled', {
      className: 'enabled',
      useValueToStyle: true,
    });
    const bytes = createLabeledStat(statsContainer, 'bytes', { className: 'bytes', useValueToStyle: true });
    bytes.setText('0');

    function listenOnMSTrack(msTrack) {
      msTrack.addEventListener('ended', () => updateStats('ended'));
      msTrack.addEventListener('mute', () => updateStats('mute'));
      msTrack.addEventListener('unmute', () => updateStats('unmute'));
    }

    track.on('disabled', () => updateStats('disabled'));
    track.on('enabled', () => updateStats('enabled'));
    track.on('stopped', () => {
      updateStats('stopped');
    });

    track.on('started', () => {
      updateStats('started');
      listenOnMSTrack(track.mediaStreamTrack);
    });

    function updateStats(event, byteUpdate) {
      if (event === 'bytes') {
        bytes.setText(byteUpdate);
      } else {
        log(`${track.sid || track.id} got: ${event}`);
        readyState.setText(track.mediaStreamTrack.readyState);
        enabled.setText(track.mediaStreamTrack.enabled);
        started.setText(track.isStarted);
        muted.setText(track.mediaStreamTrack.muted);
        trackEnabled.setText(track.isEnabled);
      }
    }

    return updateStats;
  }

  const trackStatUpdater = new Map();
  function updateTrackStats({ trackId, trackSid, bytesSent, bytesReceived, trackType }) {
    const isRemote = trackType === 'remoteVideoTrackStats' || trackType === 'remoteAudioTrackStats';
    trackStatUpdater.forEach((updateStats, track) => {
      if (track.sid === trackSid || track.id === trackId) {
        updateStats('bytes', isRemote ? bytesReceived : bytesSent);
      }
    });
  }

  function renderTrackPublication(trackPublication, container) {
    const trackContainerId = 'trackPublication_' + trackPublication.trackSid;
    const publicationContainer = createDiv(container, 'publication', trackContainerId);
    const trackKind = createElement(publicationContainer, { type: 'h3', classNames: ['trackName'] });
    const trackSid = createElement(publicationContainer, { type: 'h6', classNames: ['participantSid'] });
    trackKind.innerHTML = trackPublication.kind + ': published';
    trackSid.innerHTML = trackPublication.trackSid;

    if (trackPublication.isSubscribed) {
      renderTrack(trackPublication.track, publicationContainer);
    } else {
      console.log('not subscribed:', trackPublication);
    }
    trackPublication.on('subscribed', function(track) {
      log('Subscribed to ' + trackPublication.kind + ' track');
      renderTrack(track, publicationContainer);
    });
    trackPublication.on('unsubscribed', track => detachTrack(track, publicationContainer));
    return publicationContainer;
  }

  // Attach the Track to the DOM.
  function renderTrack(track, container, isLocal) {
    console.log(`track.sid:${track.sid}, track.id:${track.id}`);
    const trackContainerId = isLocal ? track.id : track.sid;
    const trackContainer = createDiv(container, track.kind + 'Container', trackContainerId);
    const updateStats = createTrackStats(track, trackContainer, isLocal);
    trackStatUpdater.set(track, updateStats);

    const controlContainer = createDiv(trackContainer, 'trackControls');

    if (isLocal) {
      localTracks.push(track);

      createButton('disable', controlContainer, () => track.disable());
      createButton('enable', controlContainer, () => track.enable());
      createButton('stop', controlContainer, () => track.stop());
      createButton('msstop', controlContainer, () => {
        track.mediaStreamTrack.stop();
        updateStats();
      });

      let trackPublication = null;
      let unPublishBtn = null;
      const publishBtn = createButton('publish', controlContainer, async () => {
        trackPublication = await activeRoom.localParticipant.publishTrack(track);
        publishBtn.show(!trackPublication);
        unPublishBtn.show(!!trackPublication);
      });

      unPublishBtn = createButton('unpublish', controlContainer, () => {
        if (trackPublication) {
          trackPublication.unpublish();
          trackPublication = null;
          publishBtn.show(!trackPublication);
          unPublishBtn.show(!!trackPublication);
        }
      });

      const onRoomChanged = room => {
        if (room) {
          trackPublication = [...room.localParticipant.tracks.values()].find(trackPub => trackPub.track === track);
        }
        publishBtn.show(room && !trackPublication);
        unPublishBtn.show(room && !!trackPublication);
      };

      // show hide publish button on room joining/leaving.
      roomChangeMonitor.register(onRoomChanged);

      // if autoPublish and room exits, publish the track
      if (roomChangeMonitor.room && autoPublish.checked) {
        publishBtn.click();
      }

      createButton('close', controlContainer, () => {
        var index = localTracks.indexOf(track);
        if (index > -1) {
          localTracks.splice(index, 1);
        }
        trackContainer.remove();
        roomChangeMonitor.unregister(onRoomChanged);
      });
    }

    createButton('update', controlContainer, () => updateStats('update'));

    let mediaControls = null;
    const attachDetachBtn = createButton('attach', controlContainer, () => {
      if (mediaControls) {
        // track is already attached.
        track.detach().forEach(el => el.remove());
        mediaControls.remove();
        mediaControls = null;
        attachDetachBtn.text('attach');
      } else {
        // track is detached.
        mediaControls = createDiv(trackContainer, 'mediaControls');
        let audioVideoElement = null;
        if (track.kind === 'audio') {
          audioVideoElement = attachAudioTrack(track, mediaControls);
        } else {
          audioVideoElement = track.attach();
          mediaControls.appendChild(audioVideoElement);
        }
        createButton('pause', mediaControls, () => audioVideoElement.pause());
        createButton('play', mediaControls, () => audioVideoElement.play());
        createButton('update', mediaControls, () => updateMediaElementState('update'));
        const isPlaying = createLabeledStat(mediaControls, 'playing', { className: 'enabled', useValueToStyle: true });
        const volume = createLabeledStat(mediaControls, 'volume', { className: 'bytes', useValueToStyle: true });
        // eslint-disable-next-line no-inner-declarations
        function updateMediaElementState(event) {
          log(`${track.sid || track.id} got: ${event}`);
          isPlaying.setText(!audioVideoElement.paused);
          volume.setText(audioVideoElement.volume);
        }

        audioVideoElement.addEventListener('pause', () => updateMediaElementState('pause'));
        audioVideoElement.addEventListener('play', () => updateMediaElementState('play'));
        attachDetachBtn.text('detach');
        updateMediaElementState('initial');
      }
    });
    if (autoAttach.checked) {
      attachDetachBtn.click();
    }
    updateStats('initial');
    return trackContainer;
  }

  // Detach given track from the DOM.
  function detachTrack(track, container) {
    const trackContainer = document.getElementById(track.sid);
    track.detach().forEach(function(element) {
      element.remove();
    });
    trackStatUpdater.delete(track);
    container.removeChild(trackContainer);
  }

  // Attach array of Tracks to the DOM.
  function renderTracks(tracks, container, isLocal) {
    tracks.forEach(track => renderTrack(track, container, isLocal));
  }

  // A new RemoteTrack was published to the Room.
  function trackPublished(publication, container) {
    renderTrackPublication(publication, container);
  }

  // A RemoteTrack was unpublished from the Room.
  function trackUnpublished(publication, container) {
    const publicationDivId = 'trackPublication_' + publication.trackSid;
    const trackContainer = document.getElementById(publicationDivId);
    container.removeChild(trackContainer);
  }

  // A new RemoteParticipant joined the Room
  function participantConnected(participant, container, isLocal = false) {
    let selfContainer = createDiv(container, 'participantDiv', `participantContainer-${participant.identity}`);

    const name = createElement(selfContainer, { type: 'h2', classNames: ['participantName'] });
    name.innerHTML = participant.identity;

    const participantMediaDiv = getChildDiv(selfContainer, 'participantMediaDiv');

    if (isLocal) {
      renderTracks(getTracks(participant), participantMediaDiv, isLocal);
    } else {
      participant.tracks.forEach(publication => trackPublished(publication, participantMediaDiv));
      participant.on('trackPublished', publication => trackPublished(publication, participantMediaDiv));
      participant.on('trackUnpublished', publication => trackUnpublished(publication, participantMediaDiv));
    }
  }

  function participantDisconnected(participant) {
    const container = document.getElementById(`participantContainer-${participant.identity}`);
    var tracks = getTracks(participant);
    tracks.forEach(track => detachTrack(track, container));
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }

  // When we are about to transition away from this page, disconnect
  // from the room, if joined.
  window.addEventListener('beforeunload', leaveRoomIfJoined);

  function joinRoom(token) {
    var roomName = roomNameInput.value;
    if (!roomName) {
      // eslint-disable-next-line no-alert
      alert('Please enter a room name.');
      return;
    }

    log(`Joining room ${roomName} ${autoPublish.checked ? 'with' : 'without'} ${localTracks.length} localTracks`);
    var connectOptions = {
      tracks: autoPublish.checked ? localTracks : [],
      name: roomName,
      logLevel: 'debug',
    };
    // Join the Room with the token from the server and the
    // LocalParticipant's Tracks.

    Video.connect(token, connectOptions)
      .then(roomJoined)
      .catch(error => {
        log('Could not connect to Twilio: ' + error.message);
      });
  }

  function updateControls(connected) {
    roomSid.innerHTML = connected ? activeRoom.sid : 'Room: Not Joined';
    localIdentity.innerHTML = connected ? activeRoom.localParticipant.identity : 'Identity: Unknown';
    roomControlsDiv.style.display = 'block';

    [btnLeave].forEach(btn => {
      btn.disabled = connected === false;
    });

    [btnJoin].forEach(btn => {
      btn.disabled = connected === true;
    });

    [btnPreviewAudio, btnPreviewVideo].forEach(btn => {
      btn.disabled = false;
    });
  }

  (async function main() {
    updateControls(false);
    roomChangeMonitor.emitRoomChange(null);
    if (token || tokenUrl) {
      try {
        if (!token) {
          log(`getting token from: ${tokenUrl}`);
          token = (await getRoomCredentials(tokenUrl)).token;
        }

        btnLeave.onclick = function() {
          log('Leaving room...');
          activeRoom.disconnect();
          roomChangeMonitor.emitRoomChange(null);
        };

        btnJoin.onclick = () => joinRoom(token);
        if (autoJoin.checked) {
          btnJoin.onclick();
        }
      } catch (err) {
        log('failed to obtain token', err);
      }
    } else {
      log('token was not specified.');
    }
    listenForVisibilityChange();
  })();

  // Get the Participant's Tracks.
  function getTracks(participant) {
    return Array.from(participant.tracks.values())
      .filter(function(publication) {
        return publication.track;
      })
      .map(function(publication) {
        return publication.track;
      });
  }

  // Successfully connected!
  function roomJoined(room) {
    roomChangeMonitor.emitRoomChange(room);
    updateControls(true);

    log("Joined as '" + activeRoom.localParticipant.identity + "'");
    room.participants.forEach(function(participant) {
      log("Already in Room: '" + participant.identity + "'");
      participantConnected(participant, remoteParticipantsContainer);
    });

    // When a Participant joins the Room, log the event.
    room.on('participantConnected', function(participant) {
      log("Joining: '" + participant.identity + "'");
      participantConnected(participant, remoteParticipantsContainer);
    });

    // When a Participant leaves the Room, detach its Tracks.
    room.on('participantDisconnected', function(participant) {
      log("RemoteParticipant '" + participant.identity + "' left the room");
      participantDisconnected(participant);
    });

    var statUpdater = setInterval(async () => {
      const statReports = await room.getStats();
      statReports.forEach(statReport => {
        ['remoteVideoTrackStats', 'remoteAudioTrackStats', 'localAudioTrackStats', 'localVideoTrackStats'].forEach(
          trackType => {
            statReport[trackType].forEach(trackStats => updateTrackStats({ ...trackStats, trackType }));
          }
        );
      });
    }, 100);

    // Once the LocalParticipant leaves the room, detach the Tracks
    // of all Participants, including that of the LocalParticipant.
    room.on('disconnected', (_, err) => {
      log('Left:', err);
      clearInterval(statUpdater);
      room.participants.forEach(participantDisconnected);
      activeRoom = null;
      updateControls(false);
    });
  }

  window.tracks = [];
  async function createLocalTrack(video) {
    const container = video ? localVideoTrackContainer : localAudioTrackContainer;
    try {
      const localTrack = video
        ? await Video.createLocalVideoTrack({
            logLevel: 'debug',
            frameRate: 24,
            height: 720,
            width: 1280,
            name: `camera-${Date.now()}`,
          })
        : await Video.createLocalAudioTrack({ logLevel: 'debug' /* , workaroundWebKitBug1208516: true */ });

      window.tracks.push(localTrack);
      const trackContainer = renderTrack(localTrack, container, true);
      console.log('localTracks.length:', localTracks.length);

      createButton('clone', trackContainer, () => {
        const clonedMSTrack = localTrack.mediaStreamTrack.clone();
        const cloneBtn = createButton(' stop clone', trackContainer, () => {
          clonedMSTrack.stop();
          cloneBtn.btn.remove();
        });
        const cloned = new Video.LocalAudioTrack(clonedMSTrack);
        renderTrack(cloned, container, true);
      });
    } catch (err) {
      const { code, name, message } = err;
      log(`createLocalAudioTrack error: code:${code}, name:${name}, message:${message}`, err);
    }
  }
  btnPreviewAudio.onclick = async () => {
    await createLocalTrack(false);
  };

  btnPreviewVideo.onclick = async () => {
    await createLocalTrack(true);
  };

  let unPublished = false;
  function listenForVisibilityChange() {
    document.addEventListener(
      'visibilitychange',
      async () => {
        if (document.hidden) {
          if (roomChangeMonitor.room) {
            const videoTracks = [...roomChangeMonitor.room.localParticipant.videoTracks.values()];
            videoTracks.forEach(track => {
              roomChangeMonitor.room.localParticipant.unpublishTrack(track.track);
              track.track.stop();
              unPublished = true;
            });
          }
        } else {
          log('document was visible');
          if (roomChangeMonitor.room && unPublished) {
            await createLocalTrack(true);
          }
        }
      },
      false
    );
  }

  // Leave Room.
  function leaveRoomIfJoined() {
    if (activeRoom) {
      activeRoom.disconnect();
    }
    roomChangeMonitor.emitRoomChange(null);
  }
}
