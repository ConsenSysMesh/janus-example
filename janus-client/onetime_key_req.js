const commandLineArgs = require('command-line-args');
var util = require("./util");
var guid = require("guid-typescript");
let url = process.env.NODE_URL || "0.0.0.0";
let port = process.env.NODE_PORT || 10000;

const optionDefinitions = [
    { name: 'txnRef', alias: 't', type: String },
    { name: 'parties', type: String, multiple: true, defaultOption: true }
]
const options = commandLineArgs(optionDefinitions)
const companyName = process.env.COMPANY_NAME
let txnRef = options["txnRef"]
if(!txnRef)
    txnRef = guid.Guid.create().toString();  
let parties = options["parties"]
if(!parties) 
    parties = [companyName];

let request = {txnRef: txnRef, networkId: "1", parties: parties}
console.log("Request:", request);

util.raiseHttpRequest(url, port, "/requestOnetimeKeys", "POST", request).then(response => {
    console.log("Onetime Key request sent, waiting for response..");
    request = {txnRef: txnRef, networkId: "1"};
    util.raiseHttpRequest(url, port, "/getOnetimeKeys", "POST", request, 5000).then(response => {
        console.log("Response:", JSON.stringify(response,null,4));
    }).catch(error => {
        console.log("Failed to get OTA:", error);
    })
}).catch(error => {
    console.log("Failed to request OTA:", error);
})
