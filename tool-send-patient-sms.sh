#!/bin/bash
set -e

if [[ -z ${ACCOUNT_SID} ]]; then echo 'ACCOUNT_SID unset!'; exit 1; fi
if [[ -z ${AUTH_TOKEN} ]];  then echo 'AUTH_TOKEN unset!'; exit 1; fi
AUTHENTICATION="${ACCOUNT_SID}:${AUTH_TOKEN}"

SERVICE_SID=$(twilio rtc:apps:video:view \
  | grep 'Edit your token server' \
  | sed 's/.*\(ZS[0-9a-z]*\)\/environment.*/\1/')

ENVIRONMENT_SID=$(curl --silent --user ${AUTHENTICATION} \
  -X GET "https://serverless.twilio.com/v1/Services/${SERVICE_SID}/Environments" \
  | jq --raw-output '.environments[0] | .sid')

fromPhone=$(curl --silent --user ${AUTHENTICATION} \
  -X GET https://serverless.twilio.com/v1/Services/${SERVICE_SID}/Environments/${ENVIRONMENT_SID}/Variables \
  | jq --raw-output '.variables[] | select(.key | contains("TWILIO_FROM_PHONE")) | .value')
echo "Sending From Phone: ${fromPhone}"

defaultRoomName="Video Visit Room 0"
read -p "Enter video room Name (default ${defaultRoomName}): " roomName
if [[ -z ${roomName} ]]; then
  roomName=${defaultRoomName}
fi

read -p "Enter To Phone (E164 format): " toPhone
if [[ -z ${toPhone} ]]; then echo 'You must enter toPhone!'; exit 1; fi

read -p "Enter Patient Name: " patientName
if [[ -z ${patientName} ]]; then echo 'You must enter patientName!'; exit 1; fi

url=$(twilio rtc:apps:video:view | grep 'Web App URL' | sed -e 's/Web App URL: //')
host=${url%\?*}
passcode=${url#*\?}

patientURL="${host}/?room=${roomName// /%20}&persona=patient&name=${patientName// /%20}&${passcode}"
echo "patient URL:"
echo "${patientURL}"
echo

body="Hello, ${patientName}. Please join your video appointment at ${patientURL}"

curl -X POST https://api.twilio.com/2010-04-01/Accounts/${ACCOUNT_SID}/Messages.json \
--data-urlencode "From=${fromPhone}" \
--data-urlencode "Body=${body}" \
--data-urlencode "To=${toPhone}" \
--user ${AUTHENTICATION}
