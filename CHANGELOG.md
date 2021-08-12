## 0.5.0 (August 9, 2021)

### New Feature

- This release adds a virtual background feature. This feature allows users to blur their background or apply a background image from the background selection window. The virtual backgrounds are applied to the video tracks using the [Twilio Video Processors SDK](https://www.twilio.com/docs/video/video-processors). For more information, please view this [blog post](https://www.twilio.com/blog/introducing-virtual-backgrounds-browser-based-video-applications). [#574](https://github.com/twilio/twilio-video-app-react/pull/574)

### Dependency Upgrades

- `@material-ui/core` has been updated from 4.9.1. to 4.12.3. [#568](https://github.com/twilio/twilio-video-app-react/pull/568)
- `@material-ui/icons` has been updated from 4.9.1. to 4.11.12. [#568](https://github.com/twilio/twilio-video-app-react/pull/568)
- `@twilio/conversations` has been updated from 1.1.0. to 1.2.3. [#568](https://github.com/twilio/twilio-video-app-react/pull/568)

## 0.4.2 (July 29, 2021)

### Dependency Upgrades

- `twilio-video` has been upgraded from 2.14.0 to 2.15.3. This fixes an issue that was introduced in Chrome 92 where a limit on the number of `WebMediaPlayers` has been added. See [this GitHub issue](https://github.com/twilio/twilio-video.js/issues/1528) for more information. [#562](https://github.com/twilio/twilio-video-app-react/pull/562)

### Bugfixes

- Audio and Video track components now set their `<audio>` or `<video>` element's `srcObject` to `null` after the tracks are unmounted. This helps to fix the above mentioned issue introduced in Chrome 92. [#562](https://github.com/twilio/twilio-video-app-react/pull/562)

## 0.4.1 (June 10, 2021)

### Bugfixes

- Error messages have been improved on the Device Selection Screen when a user denies permission for audio, video, or both. [#530](https://github.com/twilio/twilio-video-app-react/pull/530)
- Fix issue where users were unable to acquire audio in Firefox. [#526](https://github.com/twilio/twilio-video-app-react/pull/526)
- The size of the thumbnails in the Participants list has been reduced as well as the gap in between each of them. [#524](https://github.com/twilio/twilio-video-app-react/pull/524)

### Thanks!

- Thank you to @hanhlee [#527](https://github.com/twilio/twilio-video-app-react/pull/527), @t4nmoy [#528](https://github.com/twilio/twilio-video-app-react/pull/528), and @arturodr [#529](https://github.com/twilio/twilio-video-app-react/pull/529) for your help with detecting typos and unnecessary dependencies!

## 0.4.0 (May 12, 2021)

### New Feature

- This release adds a Start-Stop Recording feature for Group Rooms. This feature allows users to control when to record the contents of the Video Room. Recordings are on a per Track basis and are accessible via the Twilio Console. This feature is powered by the [Twilio Recording Rules API](https://www.twilio.com/docs/video/api/recording-rules). For more information on the Recording Rules API, please see this [blog post](https://www.twilio.com/blog/video-recording-rules-api).

## 0.3.2 (May 11, 2021)

### New Feature

This release upgrades `twilio-video` to version 2.14.0 which contains a significant update to the Bandwidth Profile API. This new version deprecates the `maxTracks` and `renderDimensions` settings and introduces the `clientTrackSwitchOffControl` and `contentPreferencesMode` settings. The "Connection Settings" modal in this app has been updated to reflect these new options.

The `clientTrackSwitchOffControl` and `contentPreferencesMode` settings allow for more efficient use of bandwidth and CPU in multi-party applications. Learn more about these new features in the twilio-video.js [CHANGELOG](https://github.com/twilio/twilio-video.js/blob/master/CHANGELOG.md#2140-may-11-2021).

### Bugfixes

- The appearance of the text input field in the chat window has been improved in Firefox. [#512](https://github.com/twilio/twilio-video-app-react/pull/512).
- Fix automatic audio track restart in Firefox. [#507](https://github.com/twilio/twilio-video-app-react/pull/507)
- Fix issue related to the selection of video input devices when the app runs for the first time. [#508](https://github.com/twilio/twilio-video-app-react/pull/508)
- Display network quality meter for main participant. [#499](https://github.com/twilio/twilio-video-app-react/pull/499)

### Dependency Upgrades

- `twilio-video` has been upgraded from 2.13.1 to 2.14.0. [#506](https://github.com/twilio/twilio-video-app-react/pull/506)

## 0.3.1 (April 15, 2021)

### Bugfixes

- User can now be heard by other participants after their audio input device is removed. [#487](https://github.com/twilio/twilio-video-app-react/pull/487)
- Added missing `trackSwitchOffMode` to `connectionOptions` object in `useConnectionOptions` hook. [#488](https://github.com/twilio/twilio-video-app-react/pull/488)
- Removed preflight test from app. [#489](https://github.com/twilio/twilio-video-app-react/pull/489)

## 0.3.0 (March 31, 2021)

### New Feature

- This release adds an in-room chat feature. This chat feature allows users to send and receive textual messages and files while connected to a Twilio Video room. This feature is powered by the [Twilio Conversations API](https://www.twilio.com/conversations-api). For more information, please see this [blog post](https://www.twilio.com/blog/open-source-video-chat-app-reactjs-conversations-api).

## 0.2.4 (March 23, 2021)

### Bugfixes

- Screen sharing track is stopped when disconnected from a room due to network issues. [#452](https://github.com/twilio/twilio-video-app-react/pull/452)
- The `<UnsupportedBrowserWarning />` component has been moved to fix an issue with the app crashing on devices where `navigator.mediaDevices` doesn't exist. [#447](https://github.com/twilio/twilio-video-app-react/pull/447)
- The Typescript definition for the `room` object has been improved. [#434](https://github.com/twilio/twilio-video-app-react/pull/434)
- Fix NPM script to lint files. [#432](https://github.com/twilio/twilio-video-app-react/pull/432)

### Dependency Upgrades

- `react-scripts` has been upgraded from 4.0.2 to 4.0.3. [#432](https://github.com/twilio/twilio-video-app-react/pull/432)
- `ts-jest` has been upgraded from 24.3.0 to 26.5.1. [#432](https://github.com/twilio/twilio-video-app-react/pull/432)
- `react-dev-utils` has been upgraded from 11.0.3 to 11.0.4 [#455](https://github.com/twilio/twilio-video-app-react/pull/455)
- `twilio-video` has been upgraded from 2.11.0 to 2.13.1. [#466](https://github.com/twilio/twilio-video-app-react/pull/466)

## 0.2.3 (February 19, 2021)

### Bugfixes

- Update `VideoInputList` so that the app doesn't crash when the deivce is changed while the camera is off. [#412](https://github.com/twilio/twilio-video-app-react/pull/412)

### Dependency Upgrades

- `react-scripts` has been upgraded from 3.4.4 to 4.0.2. [#416](https://github.com/twilio/twilio-video-app-react/pull/416)

## 0.2.2 (February 2, 2021)

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

## 0.2.1 (October 26, 2020)

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

## 0.2.0 (September 30, 2020)

This release contains support for the Programmable Video Go room type and an overhauled UI/UX experience.

### Go Room Type

The Go room type provides a similar peer-to-peer video app experience except for a smaller limit of two participants. If more than two participants join a room with this room type, then the video app will present an error. To learn more about Go, please visit the [Twilio blog](https://www.twilio.com/blog/announcing-twilio-video-webrtc-go).

### Design Refresh

The user journey was redesigned from the ground up. Users are now presented with an updated “lobby” experience prior to joining the room. Users can select their audio and video devices, configure their connection settings, and leverage a new beta [Video JS SDK Preflight API](https://github.com/twilio/twilio-video.js/blob/preflight_api/CHANGELOG.md#280-beta1-september-28-2020) to determine if their network connection is suitable to provide an optimal video app experience.

Users are then presented with an updated “in room” experience. All of the media and room controls have been moved to a dedicated toolbar at the bottom of the page and the primary view remains the dominant speaker or the participant sharing their screen. In general the experience feels similar to before with just much more polish!

Additionally, all the UI/UX improvements have been implemented on mobile web browsers as well.

## 0.1.0 (March 6, 2020)

This release marks the first iteration of the Twilio Video Collaboration App: a canonical multi-party collaboration video application built with Programmable Video. This application demonstrates the capabilities of Programmable Video and serves as a reference to developers building video apps.

This initial release comes with the following features:

- Join rooms with up to 50 participants
- Toggle local media: camera, audio, and screen.
- Show a Room’s dominant speaker in the primary video view
- Show a participant’s network quality

We intend to iterate on this initial set of features and we look forward to collaborating with the community.
