#!/bin/bash
set -e

if [[ -z ${ACCOUNT_SID} ]]; then echo 'ACCOUNT_SID unset!'; exit 1; fi
if [[ -z ${AUTH_TOKEN} ]];  then echo 'AUTH_TOKEN unset!'; exit 1; fi
AUTHENTICATION="${ACCOUNT_SID}:${AUTH_TOKEN}"

defaultFromPhone="+18312925224"  # set your default here
read -p "Enter From Phone (default ${defaultFromPhone}): " fromPhone
if [[ -z ${fromPhone} ]]; then
  fromPhone=${defaultFromPhone}
fi

read -p "Enter To Phone: " toPhone
if [[ -z ${toPhone} ]]; then echo 'You must enter toPhone!'; exit 1; fi

read -p "Enter Patient Name: " patientName
if [[ -z ${patientName} ]]; then echo 'You must enter patientName!'; exit 1; fi

read -p "Enter Patient URL: " url
if [[ -z ${url} ]]; then echo 'You must enter patient url!'; exit 1; fi

body="Hello, ${patientName}. Please join your video appointment at ${url}"


curl -X POST https://api.twilio.com/2010-04-01/Accounts/${ACCOUNT_SID}/Messages.json \
--data-urlencode "From=${fromPhone}" \
--data-urlencode "Body=${body}" \
--data-urlencode "To=${toPhone}" \
--user ${AUTHENTICATION}
