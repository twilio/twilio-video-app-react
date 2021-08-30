#!/bin/bash
set -e

if [[ -z ${ACCOUNT_SID} ]]; then echo 'ACCOUNT_SID unset!'; exit 1; fi
if [[ -z ${AUTH_TOKEN} ]];  then echo 'AUTH_TOKEN unset!'; exit 1; fi
AUTHENTICATION="${ACCOUNT_SID}:${AUTH_TOKEN}"

SERVICE_SID=$(twilio rtc:apps:video:view \
| grep 'Edit your token server' \
| sed 's/.*\(ZS[0-9a-z]*\)\/environment.*/\1/')
echo "SERVICE_SID: ${SERVICE_SID}"

SERVICE_UNIQUE_NAME=$(curl --silent --user ${AUTHENTICATION} \
  -X GET "https://serverless.twilio.com/v1/Services/${SERVICE_SID}" \
  | jq --raw-output .unique_name)
echo "SERVICE_UNIQUE_NAME: ${SERVICE_UNIQUE_NAME}"

# ---------- first build will always return latest
# runtime
RUNTIME=$(curl --silent --user ${AUTHENTICATION} \
  -X GET "https://serverless.twilio.com/v1/Services/${SERVICE_SID}/Builds" \
  | jq --raw-output '.builds[0] | .runtime')
echo "Runtime: ${RUNTIME}"

# dependencies
DEPENDENCIES=$(curl --silent --user ${AUTHENTICATION} \
  -X GET "https://serverless.twilio.com/v1/Services/${SERVICE_SID}/Builds" \
  | jq --raw-output --compact-output '.builds[0] | .dependencies')
echo "Depedencies: ${DEPENDENCIES}"

# function versions
echo -n 'Functions count: '
curl --silent --user ${AUTHENTICATION} \
  -X GET "https://serverless.twilio.com/v1/Services/${SERVICE_SID}/Functions" \
  | jq --raw-output '.functions | length'

declare -a FUNCTION_SID_ARRAY
FUNCTION_SID_ARRAY=($(curl --silent --user ${AUTHENTICATION} \
  -X GET "https://serverless.twilio.com/v1/Services/${SERVICE_SID}/Functions" \
  | jq --raw-output '.functions[] | .sid'))

declare -a FUNCTION_VERSIONS
i=0
for fsid in "${FUNCTION_SID_ARRAY[@]}"
do
  fvsid=$(curl --silent --user ${AUTHENTICATION} \
    -X GET "https://serverless.twilio.com/v1/Services/${SERVICE_SID}/Functions/${fsid}/Versions" \
    | jq --raw-output '.function_versions[0] | .sid')
  echo "Function Version for ${fsid}: ${fvsid}"
  FUNCTION_VERSIONS[$i]=${fvsid}
  i=$((i+1))
done

# asset versions
echo -n 'Assets count: '
curl --silent --user ${AUTHENTICATION} \
  -X GET "https://serverless.twilio.com/v1/Services/${SERVICE_SID}/Builds" \
  | jq --raw-output '.builds[0] | .asset_versions | length'

declare -a ASSET_VERSIONS
ASSET_VERSIONS=($(curl --silent --user ${AUTHENTICATION} \
  -X GET "https://serverless.twilio.com/v1/Services/${SERVICE_SID}/Builds" \
  | jq --raw-output '.builds[0] | .asset_versions[] | .sid'))


# build resources
# - Runtime & Dependencies need not be specified, existing ones will be preserved
BUILD_RUNTIME=" --data-urlencode \"Runtime=${RUNTIME}\""
BUILD_DEPENDENCIES=" --data-urlencode \"Dependencies=${DEPENDENCIES}\""

BUILD_FUNCTION_VERSIONS=""
for fvsid in "${FUNCTION_VERSIONS[@]}"
do
  BUILD_FUNCTION_VERSIONS="${BUILD_FUNCTION_VERSIONS} --data-urlencode FunctionVersions=${fvsid}"
done

BUILD_ASSET_VERSIONS=""
for avsid in "${ASSET_VERSIONS[@]}"
do
  BUILD_ASSET_VERSIONS="${BUILD_ASSET_VERSIONS} --data-urlencode AssetVersions=${avsid}"
done

BUILD_CMD="curl --silent --user ${AUTHENTICATION}  -X POST https://serverless.twilio.com/v1/Services/${SERVICE_SID}/Builds ${BUILD_FUNCTION_VERSIONS}"
echo "Build Command: ${BUILD_CMD}"


BUILD_SID=$(${BUILD_CMD} | jq --raw-output '.sid')
if [[ -z ${BUILD_SID} ]]; then
  echo "failed build: ${BUILD_CMD}"
else
  echo "started build: ${BUILD_SID}"
fi
BUILD_STATUS='building'
echo -n "build status: "
while [[ ${BUILD_STATUS} == 'building' ]]; do
  BUILD_STATUS=$(curl --silent --user ${AUTHENTICATION} \
    -X GET "https://serverless.twilio.com/v1/Services/${SERVICE_SID}/Builds/${BUILD_SID}/Status" \
    | jq --raw-output '.status')
  echo -n "."
  sleep 2
done
echo " complete"


ENVIRONMENT_SID=$(curl --silent --user ${AUTHENTICATION} \
  -X GET "https://serverless.twilio.com/v1/Services/${SERVICE_SID}/Environments" \
  | jq --raw-output '.environments[0] | .sid')
echo "found enviroment: ${ENVIRONMENT_SID}"


DEPLOYMENT_SID=$(curl --silent --user ${AUTHENTICATION} \
  -X POST "https://serverless.twilio.com/v1/Services/${SERVICE_SID}/Environments/${ENVIRONMENT_SID}/Deployments" \
  --data-urlencode "BuildSid=${BUILD_SID}")
echo "deployed: ${DEPLOYMENT_SID}"
