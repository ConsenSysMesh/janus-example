const commandLineArgs = require('command-line-args');
var Web3 = require("web3");
var ethers = require('ethers');
var fs = require('fs');

const optionDefinitions = [
    { name: 'password', alias: 'p', type: String },
    { name: 'nodeUrl', type: String }
]
const options = commandLineArgs(optionDefinitions)
let nodeUrl = options["nodeUrl"]
let password = options["password"]
if(nodeUrl)
    web3 = new Web3(new Web3.providers.HttpProvider(nodeUrl));

//let accountAddress = web3.personal.newAccount(password)
//console.log("account:", accountAddress)
let keyId = web3.shh.newKeyPair()
let pubKey = web3.shh.getPublicKey(keyId)
let prvKey = web3.shh.getPrivateKey(keyId)
console.log(pubKey);

var wallet = new ethers.Wallet(prvKey);
wallet.encrypt(password).then(function(json) { 
    //console.log(json) 
    fs.writeFile('/config/shh_keystore', json, function (err) {
        if (err) throw err;
    });
});
