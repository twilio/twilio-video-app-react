#!/bin/bash
set -e

if [[ -z ${ACCOUNT_SID} ]]; then echo 'ACCOUNT_SID unset!'; exit 1; fi
if [[ -z ${AUTH_TOKEN} ]];  then echo 'AUTH_TOKEN unset!'; exit 1; fi
AUTHENTICATION="${ACCOUNT_SID}:${AUTH_TOKEN}"

fname='/get-room-participant-count'
fpath='functions/get-room-participant-count.js'

SERVICE_SID=$(twilio rtc:apps:video:view \
| grep 'Edit your token server' \
| sed 's/.*\(ZS[0-9a-z]*\)\/environment.*/\1/')
echo "SERVICE_SID: ${SERVICE_SID}"

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


echo "Please goto Twilio console https://console.twilio.com/"
echo "Open the telehealth service: ${SERVICE_UNIQUE_NAME}"
echo "Click 'Deploy All' to deploy this function along with app"
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

#FVERSION_SID=$(curl --silent --user ${AUTHENTICATION} \
#  -X GET "https://serverless.twilio.com/v1/Services/${SERVICE_SID}/Functions/${FUNCTION_SID}/Versions" \
#  | jq --raw-output '.function_versions[0] | .sid')

# after this, manually go to Twilio service console, select 'video...' service, and click 'Deploy All'

# TODO: if time permits, figure out programmatically executing 'Deploy All'

#curl --silent --user ${AUTHENTICATION} \
#  -X POST "https://serverless.twilio.com/v1/Services/${SERVICE_SID}/Builds" \
#  --data-urlencode "FunctionVersions=${FVERSION_SID}"


#BUILD_SID=$(curl --silent --user ${AUTHENTICATION} \
#  -X POST "https://serverless.twilio.com/v1/Services/${SERVICE_SID}/Builds" \
#  --data-urlencode "FunctionVersions=${FVERSION_SID}" \
#  | jq --raw-output '.sid')
#echo "started build: ${BUILD_SID}"
#BUILD_STATUS='building'
#while [[ ${BUILD_STATUS} == 'building' ]]; do
#  BUILD_STATUS=$(curl --silent --user ${AUTHENTICATION} \
#    -X GET "https://serverless.twilio.com/v1/Services/${SERVICE_SID}/Builds/${BUILD_SID}/Status" \
#    | jq --raw-output '.status')
#  echo "build status: ${BUILD_STATUS}"
#  sleep 2
#done
#echo "build completed: ${BUILD_SID}"
#
#
#ENVIRONMENT_SID=$(curl --silent --user ${AUTHENTICATION} \
#  -X GET "https://serverless.twilio.com/v1/Services/${SERVICE_SID}/Environments" \
#  | jq --raw-output '.environments[0] | .sid')
#echo "found enviroment: ${ENVIRONMENT_SID}"
#
#
#DEPLOYMENT_SID=$(curl --silent --user ${AUTHENTICATION} \
#  -X POST "https://serverless.twilio.com/v1/Services/${SERVICE_SID}/Environments/${ENVIRONMENT_SID}/Deployments" \
#  --data-urlencode "BuildSid=${BUILD_SID}")
#echo "deployed: ${DEPLOYMENT_SID}"
#
#
#exit 0
#
#curl --silent --user ${ACCOUNT_SID}:${AUTH_TOKEN} \
#    -X GET "https://serverless.twilio.com/v1/Services/ZS68ba4bbb582dc2d67068e0d2c62f1c81/Builds/ZB61298a96dab4b8b34106ec53979cf463/Status" \
#    | jq .
