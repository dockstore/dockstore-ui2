#!/bin/bash
set -o errexit
# See https://docs.aws.amazon.com/cli/latest/reference/cloudfront/update-distribution.html
#
# Expects three arguments
# 1. The origin ID whose origin path should be updated
# 2. The new origin path
# 3. The Cloudfront web distribution id
#
# The contents of the JSON from aws cloudfront get-distribution-config will be something like this:
#
# {
#      "ETag": "E22T3TN42CY2JS",
#      "DistributionConfig": {
#          "Comment": "",
#          ...
#          "Origins": {
#              "Items": [
#                 {
#                   "OriginPath": "/currentpath",
#                   "Id": "the-id",
#                   ...
#                 },
#              ],
#              ...
#      ....
#
# We need to get the ETag value, then submit the value of DistributionConfig, having modified
# the OriginPath for the specific id, something like this:
#      {
#          "Comment": "",
#          ...
#          "Origins": {
#              "Items": [
#                 {
#                   "OriginPath": "/newpath",
#                   "Id": "the-id",
#                   ...
#                 },
#              ],
#              ...
#      ....
#


ORIGIN_ID=$1
ORIGIN_PATH=$2
CF_DIST_ID=$3

aws cloudfront get-distribution-config --id $CF_DIST_ID > dist-config.json

# Extract the ETAG value. Use -r to get the raw value (without the quotes)
ETAG=`cat dist-config.json | jq -r '.ETag'`

# Only use the .DistributonConfig section, and set the origin path.
cat dist-config.json | jq --arg ORIGIN_ID "$ORIGIN_ID" --arg ORIGIN_PATH "$ORIGIN_PATH" '.DistributionConfig | (.Origins | .Items[] | select(.Id==$ORIGIN_ID) | .OriginPath) |= $ORIGIN_PATH' > new-dist-config.json

aws cloudfront update-distribution --id $CF_DIST_ID --distribution-config file://new-dist-config.json --if-match $ETAG
