var Web3 = require("web3");
var janus = require("janus");
var guid = require("guid-typescript");
var util = require("./util");
var fs = require("fs");
const http = require("http");
const config = require(process.env['CONFIG_PATH'] + "/janusconfig.json");

var janusTestJson = require("./SmartContracts/build/contracts/JanusTest.json");

var defaultNodeUrl = "http://localhost:8545";//= "http://docker.for.mac.host.internal:22001";
var defaultNetworkId = "1";

let directoryFilePath = process.env['CONFIG_PATH'] + "/directory.json";
let nodeUrl = config["nodeUrl"] || defaultNodeUrl;
let networkId = config["networkId"] || defaultNetworkId;
let companyName = config["companyName"];
let mnemonic = config["mnemonic"];
let simpleSignerKey = config["simpleSignerKey"];
//let shhKeyId = config["shhKeyId"];
var janus_instance;
var web3;

if(nodeUrl)
    web3 = new Web3(new Web3.providers.HttpProvider(nodeUrl));

console.log("Connected to node:",nodeUrl);

async function startJanus() {
    let fileDirectoryProvider = new janus.FileDirectoryProvider(directoryFilePath);
    //let shhKeyId = await fileDirectoryProvider.getCompanyKey(companyName, "shhKeyId");
    //console.log("shhKeyId", shhKeyId);
    //let shhKey = await fileDirectoryProvider.getCompanyKey(companyName, "shhKey");
    //console.log("shhKey", shhKey);
    let shhMessageProvider_janus = new janus.ShhMessageProvider();
    await shhMessageProvider_janus.init(fileDirectoryProvider, "shhKeyId");
    //let shhMessageProvider_wallet = new janus.ShhMessageProvider();
    //await shhMessageProvider_wallet.init(fileDirectoryProvider, "shhKeyId");
    //console.log("shhKey", shhMessageProvider.getPublicKey());
    let fileStorageProvider = new janus.FileStorageProvider();
    let simpleSigner = new janus.SimpleSigner(simpleSignerKey);
    
    janus_instance = new janus.Janus(companyName, mnemonic, nodeUrl,
        fileDirectoryProvider, shhMessageProvider_janus, fileStorageProvider, simpleSigner);

    //janus_instance.startHdwallet(shhMessageProvider_wallet);
    console.log("Janus for", companyName, "is initialized");
};

startJanus();

//console.log("End of script");
