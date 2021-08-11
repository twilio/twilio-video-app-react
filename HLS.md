# Telehealth v1

## Summary

Repository is https://github.com/bochoi-twlo/twilio-video-app-react
that is forked from https://github.com/twilio/twilio-video-app-react

Technical Notes: https://lucid.app/lucidchart/818360e4-fbf9-4699-b25c-e72780b9f436/edit?page=0_0#

branch `HD-17-label-changes` implements

- 3 personas (provider, patient, and thirdparty)
- direct url ink to PreJoinScreen/DeviceSelectionScreen
  using url query parameters (room, persona, name)
- Persona-specfic PreJoinScreen/DeviceSelectionScreen
  - Provider
    - placeholder text for Patient joined indicator (HD-31)
  - Patient
    - No `Cancel` button
  - 3rd Party
    - No `Cancel` button
  
### Todo Features

- Virtual Waiting Room (HD-30)
- Inviation feature for Patient (HD-28)
- Patient joined indicator for Provider at PreJoinScreen/DeviceSelectionScreen (HD-31)

## Running Locally

- must use passcode authentication method,
  when running locally, in addition to the 4 variables mentioned in README
  , add `REACT_APP_SET_AUTH=passcode`
  Note that `passcode` query parameter must be the last parameter of the url
- after deploying the app to Twilio serverless,
  run `tool-generate-urls.sh` to get direct link URLs
- run `tool-send-patient-sms.sh` to send patient SMS.
  You must already have added a phone number to your Twilio account
  to use as 'fromPhone'


