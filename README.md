# Janus

Steps to run sample application

1. Get source code:
Clone repository 
```
git clone https://github.com/ConsenSys/janus-example.git
```

2. Setup and run Quorum network in docker:
(for more information, see ./quorum-docker-Nnodes/Readme.md)

```
cd quorum-docker-Nnodes
docker build -t quorum .
cd Nnodes
./setup.sh
docker-compose up -d
cd ../..
```

3. Build janus-example:

```
cd janus-client/SmartContracts
truffle compile
cd ../..
docker build -f janusexample.dockerfile -t janus-client .
```

4. Configure janus-example:

Node: quorum nodes should be running now, in order to proceed with the below steps

Edit the `ips` variable in *setup.sh* to list two or more IP addresses on the Docker network that will host hdwallet services:
ips=("10.0.0.2" "10.0.0.3" "10.0.0.4")

Edit the `nodeIps` variable in *setup.sh* to list IP addresses on which node is running on the Docker network. Provide one node IP for each of the hdwallet instances configured above.
nodeIps=("10.0.0.11" "10.0.0.12" "10.0.0.13")

Edit the `companyNames` variables in *setup.sh* to list the company names corresponding to hdwallet configured above.
companyNames=("Bob_comp" "Alice_comp" "Tom_comp")

Edit the `mnemonics` variable in setup.sh to list the HD Wallet mnemonics for the nodes 

Run setup file in terminal window
```
cd janus-docker-Nnodes/JNnodes
./setup.sh
cd ../..
```

5. Start hdwallet services:

```
cd janus-docker-Nnodes/JNnodes
docker-compose up -d
cd ../..
```

6. Running script

# To run scripts that request onetime keys, deploy a test contract and update its data.

1. Request onetime key from first instance of janus.
docker exec -it jnnodes_janus-service_1_1 node /janus-client/onetime_key_req.js --txnRef <txnRef> --parties <companyName1> <companyName3>
Eg:

```
docker exec -it jnnodes_janus-service_1_1 node /janus-client/onetime_key_req.js --txnRef 12345 --parties Bob_comp Tom_comp
```

2. Deploy test contract from first instance of janus.
docker exec -it jnnodes_janus-service_1_1 node /janus-client/deploy_test_contract.js --txnRef <txnRef> --p1 <OTA_for_company1> --p2 <OTA_for_company3>
Eg:

```
docker exec -it jnnodes_janus-service_1_1 node /janus-client/deploy_test_contract.js --txnRef 12345 --p1 0x54C57ae841886D815e054225b9075C87058F366c --p2 0x59ec19F9BbB1B2aB1Cd79F7c71889148239EE46B
```

3. Update test contract from third instance of janus.
docker exec -it jnnodes_janus-service_3_1 node /janus-client/update_test_contract.js --txnRef <txnRef> --address <contractAddress> --value <int_value>
Eg:

```
docker exec -it jnnodes_janus-service_3_1 node /janus-client/update_test_contract.js --txnRef 12345 --address 0x8293c42e60dc2ca171657e899cc2f944404477a6 --value 112
```
<!-- node onetime_key_req.js --txnRef 12345 --parties Bob_comp Tom_comp
node deploy_test_contract.js --txnRef 12345 --p1 0x54C57ae841886D815e054225b9075C87058F366c --p2 0x59ec19F9BbB1B2aB1Cd79F7c71889148239EE46B
node update_test_contract.js --txnRef 12345 --address 0x8293c42e60dc2ca171657e899cc2f944404477a6 --value 8 -->
