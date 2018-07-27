#!/bin/bash

#
# Create all the necessary scripts, keys, configurations etc. to run
# a cluster of N HDWallet services.
#
# The services will be in Docker containers. List the IP addresses that
# they will run at below (arbitrary addresses are fine).
#
# Run the cluster with "docker-compose up -d"
#

#### Configuration options #############################################

# One Docker container will be configured for each IP address in $ips
network="nnodes_janus_net"
#subnet="10.0.0.0/24"
ips=("10.0.0.2" "10.0.0.3" "10.0.0.4")
nodeIps=("10.0.0.11" "10.0.0.12" "10.0.0.13")
companyNames=("Bob_comp" "Alise_comp" "Tom_comp")
mnemonics=("buyer try humor into improve thrive fruit funny skate velvet vanish live" 
"radar blur cabbage chef fix engine embark joy scheme fiction master release" 
"volume roast script mind garbage embark lizard utility else blur year dentist")
networkId=1
# Docker image name
image=janus-client
quorumImage=quorum

########################################################################

ninstance=${#ips[@]}

if [[ $ninstance < 1 ]]
then
    echo "ERROR: There must be more than one node IP address."
    exit 1
fi
   
./cleanup.sh

uid=`id -u`
gid=`id -g`
pwd=`pwd`


#### Create directories for each instance's configuration ##################

echo '[1] Configuring for '$ninstance' instances.'

n=1
for ip in ${ips[*]}
do
    qd=config_$n
    mkdir -p $qd

    let n++
done


#### Generating shh keys ########################################

echo '[2] Generating shh keys'

cat > directory.json <<EOF
{
EOF

password=qwertyui

n=1
for ip in ${ips[*]}
do
    qd=qdata_$n

    # Generate an shh key for the node
    resp=`docker exec -it nnodes_node_${n}_1 geth --exec "shh.newKeyPair()" attach /qdata/dd/geth.ipc`
    ShhKeyId=${resp:6:64}
    echo $ShhKeyId

    resp=`docker exec -it nnodes_node_${n}_1 geth --exec "shh.getPublicKey('$ShhKeyId')" attach /qdata/dd/geth.ipc`
    ShhKey=${resp:6:132}
    echo $ShhKey

    #account=`docker exec -it nnodes_node_${n}_1 geth --exec "personal.newAccount('$password) attach /qdata/dd/geth.ipc`
    

cat >> directory.json <<EOF
    "${companyNames[$((n-1))]}": {
        "shhKeyId": "$ShhKeyId",
        "shhKey": "$ShhKey"
EOF
if [[ $ninstance = $n ]]
then
cat >> directory.json <<EOF
    }
EOF
else
cat >> directory.json <<EOF
    },
EOF
fi
    let n++
done

cat >> directory.json <<EOF
}
EOF

#### Creating config files ################################

echo '[3] Creating config files'

n=1
for ip in ${ips[*]}
do
    qd=config_$n
    #cp templates/janusconfig.json $qd/janusconfig.json
    cat templates/janusconfig.json \
        | sed s/_nodeIp_/${nodeIps[$((n-1))]}/g \
        | sed s/_networkId_/$networkId/g \
        | sed s/_companyName_/${companyNames[$((n-1))]}/g \
        | sed "s/_mnemonic_/${mnemonics[$((n-1))]}/g" \
                > $qd/janusconfig.json
    chmod 755 $qd/janusconfig.json

    cp templates/start.sh $qd/start.sh
    chmod 755 $qd/start.sh

    cp templates/serviceconfig.yml $qd/serviceconfig.yml
    chmod 755 $qd/serviceconfig.yml

    cp directory.json $qd/directory.json
    chmod 755 $qd/directory.json

    let n++
done

rm -f directory.json

#### Createing docker-compose file ####################################

echo '[4] Creating docker-compose file'

cat > docker-compose.yml <<EOF
version: '2'
services:
EOF

n=1
for ip in ${ips[*]}
do
    qd=config_$n

    cat >> docker-compose.yml <<EOF
  janus-service_$n:
    image: $image
    volumes:
      - './$qd:/config'
    networks:
      $network:
        ipv4_address: '$ip'
    environment:
      - shhkeyPass='$password'
    ports:
      - "$((n+10000)):10000"
EOF

    let n++
done

cat >> docker-compose.yml <<EOF

networks:
  $network:
    external: true
EOF


