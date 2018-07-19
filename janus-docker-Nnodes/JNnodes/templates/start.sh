#!/bin/bash

#
# This is used at Container start up to run the HDWallet
#

set -u
set -e

### Configuration Options
#JanusCONF=/config/janusconfig.json
export CONFIG_PATH=/config

echo "Starting janus-service"
cd ../janus-service
npm start
