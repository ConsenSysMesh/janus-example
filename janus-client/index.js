var Web3 = require("web3");
var janus = require("janus");
var guid = require("guid-typescript");
var util = require("./util");
var fs = require("fs");
const http = require("http");
const config = require("../jdata/janusconfig.json");

var janusTestJson = require("./SmartContracts/build/contracts/JanusTest.json");

var defaultNodeUrl = "http://localhost:8545";//= "http://docker.for.mac.host.internal:22001";
var defaultNetworkId = "1";
var defaultDirectoryFilePath = "/jdata/directory.json";

let directoryFilePath = config["directoryFilePath"] || defaultDirectoryFilePath;
let nodeUrl = config["nodeUrl"] || defaultNodeUrl;
let networkId = config["networkId"] || defaultNetworkId;
let companyName = config["companyName"];
let mnemonic = config["mnemonic"];
let simpleSignerKey = config["simpleSignerKey"];
//let shhKeyId = config["shhKeyId"];
var hdwallet;
var web3;

if(nodeUrl)
    web3 = new Web3(new Web3.providers.HttpProvider(nodeUrl));

console.log("Connected to node:",nodeUrl);

async function test() {
    let fileDirectoryProvider = new janus.FileDirectoryProvider(directoryFilePath);
    let shhKeyId = await fileDirectoryProvider.getCompanyKey(companyName, "shhKeyId");
    console.log("shhKeyId", shhKeyId);
    let shhKey = await fileDirectoryProvider.getCompanyKey(companyName, "shhKey");
    console.log("shhKey", shhKey);
    let shhMessageProvider = new janus.ShhMessageProvider(web3, shhKeyId);
    console.log("shhKey", shhMessageProvider.getPublicKey());
    let fileStorageProvider = new janus.FileStorageProvider();
    let simpleSigner = new janus.SimpleSigner(web3, simpleSignerKey);
    
    hdwallet = new janus.Hdwallet(companyName, mnemonic, nodeUrl,
        fileDirectoryProvider, shhMessageProvider, fileStorageProvider, simpleSigner);

    console.log("Hdwallet for", companyName, "is initialized");
};

test();

//console.log("End of script");
