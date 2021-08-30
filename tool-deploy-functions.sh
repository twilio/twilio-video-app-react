#!/bin/bash
set -e

if [[ -z ${ACCOUNT_SID} ]]; then echo 'ACCOUNT_SID unset!'; exit 1; fi
if [[ -z ${AUTH_TOKEN} ]];  then echo 'AUTH_TOKEN unset!'; exit 1; fi
AUTHENTICATION="${ACCOUNT_SID}:${AUTH_TOKEN}"

SERVICE_SID=$(twilio rtc:apps:video:view \
| grep 'Edit your token server' \
| sed 's/.*\(ZS[0-9a-z]*\)\/environment.*/\1/')
echo "SERVICE_SID: ${SERVICE_SID}"
if [[ -z "${SERVICE_SID}" ]]; then
  echo "Telehealth does not seem to deployed to your Twilio Account. exiting!"
  exit 1
fi

# create/update TWILIO_FROM_PHONE
read -p "Enter Twilio Phone to send SMS from (E164 format): " twilioFromPhoneValue
if [[ -z ${twilioFromPhoneValue} ]]; then
  echo "Note that you will not be able to send SMS from the Telehealth App"
else
  twilioFromPhoneKey="TWILIO_FROM_PHONE"
  echo "twilioFromPhoneKey  : ${twilioFromPhoneKey}"
  echo "twilioFromPhoneValue: ${twilioFromPhoneValue}"
fi

ENVIRONMENT_SID=$(curl --silent --user ${AUTHENTICATION} \
  -X GET "https://serverless.twilio.com/v1/Services/${SERVICE_SID}/Environments" \
  | jq --raw-output '.environments[0] | .sid')
echo "found enviroment: ${ENVIRONMENT_SID}"

VARIABLE_SID=$(curl --silent --user ${AUTHENTICATION} \
  -X GET https://serverless.twilio.com/v1/Services/${SERVICE_SID}/Environments/${ENVIRONMENT_SID}/Variables \
  | jq --raw-output '.variables[] | select(.key | contains("'${twilioFromPhoneKey}'")) | .sid')
if [[ -z "${VARIABLE_SID}" ]]; then
  echo "creating variable ${twilioFromPhoneKey}"
  VARIABLE_SID=$(curl --silent --user ${AUTHENTICATION} \
    -X POST https://serverless.twilio.com/v1/Services/${SERVICE_SID}/Environments/${ENVIRONMENT_SID}/Variables \
    --data-urlencode "Key=${twilioFromPhoneKey}" \
    --data-urlencode "Value=${twilioFromPhoneValue}" \
    | jq --raw-output '.sid')
  echo "created variable ${twilioFromPhoneKey}: ${VARIABLE_SID}"
else
  echo "updating variable ${twilioFromPhoneKey}: ${VARIABLE_SID}"
  VARIABLE_SID=$(curl --silent --user ${AUTHENTICATION} \
    -X POST https://serverless.twilio.com/v1/Services/${SERVICE_SID}/Environments/${ENVIRONMENT_SID}/Variables/${VARIABLE_SID} \
    --data-urlencode "Key=${twilioFromPhoneKey}" \
    --data-urlencode "Value=${twilioFromPhoneValue}" \
    | jq --raw-output '.sid')
  echo "updated variable ${twilioFromPhoneKey}: ${VARIABLE_SID}"
fi


# create send-third-party-message function
fname='/get-room-participant-count'
fpath='functions/get-room-participant-count.js'

SERVICE_UNIQUE_NAME=$(curl --silent --user ${AUTHENTICATION} \
  -X GET "https://serverless.twilio.com/v1/Services/${SERVICE_SID}" \
  | jq --raw-output .unique_name)
echo "SERVICE_UNIQUE_NAME: ${SERVICE_UNIQUE_NAME}"

FUNCTION_SID=$(curl --silent --user ${AUTHENTICATION} \
  -X GET "https://serverless.twilio.com/v1/Services/${SERVICE_SID}/Functions" \
  | jq --raw-output '.functions[] | select(.friendly_name | contains("'${fname}'")) | .sid')
if [[ -z ${FUNCTION_SID} ]]; then
  echo "creating function ${fname}"
  FUNCTION_SID=$(curl --silent --user ${AUTHENTICATION} \
    -X POST "https://serverless.twilio.com/v1/Services/${SERVICE_SID}/Functions" \
    --data-urlencode "FriendlyName=${fname}" \
    | jq --raw-output .sid)
  echo "created function ${fname}: SID=${FUNCTION_SID}"
else
  echo "found function ${fname}"
fi

FV_COUNT=$(curl --silent --user ${AUTHENTICATION} \
  -X GET "https://serverless.twilio.com/v1/Services/${SERVICE_SID}/Functions/${FUNCTION_SID}/Versions" \
  | jq --raw-output '.function_versions[] | select(.path | contains("'${fname}'")) | .' \
  | jq --slurp length)
echo "found ${FV_COUNT} function versions"
echo "creating function version with path=${fpath}"
curl --user ${AUTHENTICATION} \
  -X POST "https://serverless-upload.twilio.com/v1/Services/${SERVICE_SID}/Functions/${FUNCTION_SID}/Versions" \
  -F "Content=@${fpath}; type=application/javascript" \
  -F "Path=${fname}" \
  -F "Visibility=public"
echo "created function version with path=${fpath}: SID=${FVERSION_SID}"


# create send-third-party-message function
fname2='/send-third-party-message'
fpath2='functions/send-third-party-message.js'

FUNCTION_SID=$(curl --silent --user ${AUTHENTICATION} \
  -X GET "https://serverless.twilio.com/v1/Services/${SERVICE_SID}/Functions" \
  | jq --raw-output '.functions[] | select(.friendly_name | contains("'${fname2}'")) | .sid')
if [[ -z ${FUNCTION_SID} ]]; then
  echo "creating function ${fname2}"
  FUNCTION_SID=$(curl --silent --user ${AUTHENTICATION} \
    -X POST "https://serverless.twilio.com/v1/Services/${SERVICE_SID}/Functions" \
    --data-urlencode "FriendlyName=${fname2}" \
    | jq --raw-output .sid)
  echo "created function ${fname2}: SID=${FUNCTION_SID}"
else
  echo "found function ${fname2}"
fi


FV_COUNT=$(curl --silent --user ${AUTHENTICATION} \
  -X GET "https://serverless.twilio.com/v1/Services/${SERVICE_SID}/Functions/${FUNCTION_SID}/Versions" \
  | jq --raw-output '.function_versions[] | select(.path | contains("'${fname2}'")) | .' \
  | jq --slurp length)
echo "found ${FV_COUNT} function versions"
echo "creating function version with path=${fpath2}"
curl --user ${AUTHENTICATION} \
  -X POST "https://serverless-upload.twilio.com/v1/Services/${SERVICE_SID}/Functions/${FUNCTION_SID}/Versions" \
  -F "Content=@${fpath2}; type=application/javascript" \
  -F "Path=${fname2}" \
  -F "Visibility=public"
echo "created function version with path=${fpath2}: SID=${FVERSION_SID}"


echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
echo "Please goto Twilio console https://console.twilio.com/"
echo "Open the telehealth service: ${SERVICE_UNIQUE_NAME}"
echo "Click 'Deploy All' to deploy the functions along with app"
echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
read -p "Deployment successfully? [Y/N] " response
case "${response}" in
    [yY][eE][sS]|[yY])
        echo "Redeploy completed"
        exit 0
        ;;
    *)
        echo "aborting ..."
        exit 1
        ;;
esac
