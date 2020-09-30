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
