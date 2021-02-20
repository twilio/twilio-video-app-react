## 0.2.3

### Bugfixes

- Update `VideoInputList` so that the app doesn't crash when the deivce is changed while the camera is off. [#412](https://github.com/twilio/twilio-video-app-react/pull/412)

### Dependency Upgrades

- `react-scripts` has been upgraded from 3.4.4 to 4.0.2. [#416](https://github.com/twilio/twilio-video-app-react/pull/416)

## 0.2.2

### Bugfixes

- The participant thumbnails are no longer pushed out of view on certain mobile devices. [#347](https://github.com/twilio/twilio-video-app-react/pull/347)
- Fix issue where the user's camera LED would not turn off when they click on the "Stop Video" button. [#350](https://github.com/twilio/twilio-video-app-react/pull/350)
- Fix issue where `getAudioAndVideoTracks` is repeatedly called when there is a `getUserMedia` error. [#363](https://github.com/twilio/twilio-video-app-react/pull/363)
- Update `useTrackDimensions` hook so that it correctly causes a component re-render when track dimensions change. Thanks [@tomhicks](https://github.com/tomhicks)! [#387](https://github.com/twilio/twilio-video-app-react/pull/387)
- Audio and Video tracks are now stopped when the user disconnects from the room. [#401](https://github.com/twilio/twilio-video-app-react/pull/401)
- The participant list no longer flickers when the browser is of a certain height. [#402](https://github.com/twilio/twilio-video-app-react/pull/402)

### Dependency Upgrades

- `twilio-video` has been upgraded to 2.11.0. This version includes TypeScript definitions for twilio-video.js. See the twilio-video.js [CHANGELOG](https://github.com/twilio/twilio-video.js/blob/master/CHANGELOG.md#2110-january-26-2021) for more information. ([#409](https://github.com/twilio/twilio-video-app-react/pull/409))
- `@types/twilio-video` has been removed. Type definitions are now included in `twilio-video` version 2.11.0.

## 0.2.1

### New Features

- Devices that are selected in the "Audio and Video Settings" modal will not be reset when the page is reloaded. Device IDs are stored in local storage so that the same input and output devices will be used for each session. ([#333](https://github.com/twilio/twilio-video-app-react/pull/333))

### Bug Fixes

- A pinned participant will no longer be pinned after they disconnect from a room. ([#339](https://github.com/twilio/twilio-video-app-react/pull/339))
- The throttle interval in the `VideoToggleButton` component has been incresased to avoid duplicate track publication when the button is pressed rapidly. ([#336](https://github.com/twilio/twilio-video-app-react/pull/336))
- Cypress tests have been updated to improve reliability. ([#332](https://github.com/twilio/twilio-video-app-react/pull/332))

### Dependency Upgrades

- `react-scripts` has been upgraded from 3.4.3 to 3.4.4. ([#337](https://github.com/twilio/twilio-video-app-react/pull/337))
- `firebase` has been upgraded from 7.8.0 to 7.24.0 ([#335](https://github.com/twilio/twilio-video-app-react/pull/335))
- `twilio-video` has been upgraded from 2.8.0-beta.1 to 2.8.0-beta.2. This is to include a bug fix where an iOS 14 Safari Participant is not heard by others in a Room after handling an incoming phone call. ([#344](https://github.com/twilio/twilio-video-app-react/pull/344))

## 0.2.0

This release contains support for the Programmable Video Go room type and an overhauled UI/UX experience.

### Go Room Type

The Go room type provides a similar peer-to-peer video app experience except for a smaller limit of two participants. If more than two participants join a room with this room type, then the video app will present an error. To learn more about Go, please visit the [Twilio blog](https://www.twilio.com/blog/announcing-twilio-video-webrtc-go).

### Design Refresh

The user journey was redesigned from the ground up. Users are now presented with an updated “lobby” experience prior to joining the room. Users can select their audio and video devices, configure their connection settings, and leverage a new beta [Video JS SDK Preflight API](https://github.com/twilio/twilio-video.js/blob/preflight_api/CHANGELOG.md#280-beta1-september-28-2020) to determine if their network connection is suitable to provide an optimal video app experience.

Users are then presented with an updated “in room” experience. All of the media and room controls have been moved to a dedicated toolbar at the bottom of the page and the primary view remains the dominant speaker or the participant sharing their screen. In general the experience feels similar to before with just much more polish!

Additionally, all the UI/UX improvements have been implemented on mobile web browsers as well.

## 0.1.0

This release marks the first iteration of the Twilio Video Collaboration App: a canonical multi-party collaboration video application built with Programmable Video. This application demonstrates the capabilities of Programmable Video and serves as a reference to developers building video apps.

This initial release comes with the following features:

- Join rooms with up to 50 participants
- Toggle local media: camera, audio, and screen.
- Show a Room’s dominant speaker in the primary video view
- Show a participant’s network quality

We intend to iterate on this initial set of features and we look forward to collaborating with the community.
