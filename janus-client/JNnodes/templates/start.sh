#!/bin/bash

#
# This is used at Container start up to run the HDWallet
#

set -u
set -e

### Configuration Options
JanusCONF=/jdata/janusconf.json

echo "Starting hdwallet"
cd ../janus-client

#node index.js
npm start
