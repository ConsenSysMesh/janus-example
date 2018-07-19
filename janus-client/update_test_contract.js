const commandLineArgs = require('command-line-args');
var util = require("./util");
var janusTestJson = require("./SmartContracts/build/contracts/JanusTest.json");
let url = process.env.NODE_URL || "0.0.0.0";
let port = process.env.NODE_PORT || 10000;

const optionDefinitions = [
    { name: 'txnRef', alias: 't', type: String },
    { name: 'address', alias: 'a', type: String },
    { name: 'value', alias: 'v', type: String }
]
const options = commandLineArgs(optionDefinitions)
let txnRef = options["txnRef"]
let contractAddress = options["address"]
let value = options["value"]

let txn = util.createUpdateTransaction(contractAddress, janusTestJson["abi"], "setValue", [value]);
let request = {txnRef: txnRef, networkId: "1", txn: txn}
console.log("Request:", request);

util.raiseHttpRequest(url, port, "/postTransaction", "POST", request).then(response => {
    console.log("Response:", response);
}).catch(error => {
    console.log("Failed to deploy contract:", error);
})
