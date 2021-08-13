#!/bin/bash
set -e

id=$(whoami)
defaultRoomName="tele-appointment-${id}"
read -p "Enter patient's display Name (default ${defaultRoomName}): " roomName
if [[ -z ${roomName} ]]; then
  roomName=${defaultRoomName}
fi
echo "roomName: ${roomName}"

defaultProviderName="Dr X"
read -p "Enter provider's display Name (default ${defaultProviderName}): " providerName
if [[ -z ${providerName} ]]; then
  providerName=${defaultProviderName}
fi
echo "providerName: ${providerName}"

defaultPatientName="Jane"
read -p "Enter patient's display Name (default ${defaultPatientName}): " patientName
if [[ -z ${patientName} ]]; then
  patientName=${defaultPatientName}
fi
echo "patientName: ${patientName}"

url=$(twilio rtc:apps:video:view | grep 'Web App URL' | sed -e 's/Web App URL: //')
echo "url: ${url}"

host=${url%\?*}
echo "host: ${host}"

passcode=${url#*\?}
echo "passcode: ${passcode}"

echo
echo "provider link"
echo "${host}/?room=${roomName}&persona=provider&name=${providerName}&${passcode}"

echo
echo "patient link"
echo "${host}/?room=${roomName}&persona=patient&name=${patientName}&${passcode}"

echo
echo "3rd party link"
echo "${host}/?room=${roomName}&persona=thirdparty&name=UncleFrank&${passcode}"
echo
