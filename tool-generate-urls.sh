#!/bin/bash
set -e

defaultRoomName="Video Visit Room 0"
read -p "Enter video room Name (default ${defaultRoomName}): " roomName
if [[ -z ${roomName} ]]; then
  roomName=${defaultRoomName}
fi

defaultProviderName="Dr X"
read -p "Enter provider's display Name (default ${defaultProviderName}): " providerName
if [[ -z ${providerName} ]]; then
  providerName=${defaultProviderName}
fi


defaultPatientName="Jane"
read -p "Enter patient's display Name (default ${defaultPatientName}): " patientName
if [[ -z ${patientName} ]]; then
  patientName=${defaultPatientName}
fi


url=$(twilio rtc:apps:video:view | grep 'Web App URL' | sed -e 's/Web App URL: //')
echo "url: ${url}"

host=${url%\?*}
echo "host: ${host}"

passcode=${url#*\?}
echo "passcode: ${passcode}"

roomName=${roomName// /%20}
providerName=${providerName// /%20}
patientName=${patientName// /%20}

echo
echo "provider link:"
echo "${host}/?room=${roomName}&persona=provider&name=${providerName}&${passcode}"

echo
echo "sample patient link:"
echo "${host}/?room=${roomName}&persona=patient&name=${patientName}&${passcode}"

echo
echo "sample 3rd party link:"
echo "${host}/?room=${roomName}&persona=thirdparty&name=Uncle%20Frank&${passcode}"
echo
