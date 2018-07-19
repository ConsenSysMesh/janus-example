var coder = require("./node_modules/web3/lib/solidity/coder");
//var web3 = require("web3");
var _ = require('lodash');
var SolidityFunction = require('web3/lib/web3/function');
var http = require('http');

var Util = function () {
};

Util.prototype.encodeConstructorParams = function (abi, params) {
    return abi.filter(function (json) {
        return json.type === 'constructor' && json.inputs.length === params.length;
    }).map(function (json) {
        return json.inputs.map(function (input) {
            return input.type;
        });
    }).map(function (types) {
        return coder.encodeParams(types, params);
    })[0] || '';
};

Util.prototype.encodeFunctionParams = function (contractAddress, abi, fnName, params) {
    var solidityFunction = new SolidityFunction('', _.find(abi, { name: fnName }), contractAddress);
    return solidityFunction.toPayload(params).data;
};

Util.prototype.createDeployTransaction = function (abi, bytecode, params) {
    let payloadData = bytecode + this.encodeConstructorParams(abi, params);
    
    let transaction = {
        gasPrice: 0,
        gasLimit: 3000000,
        data: payloadData
    };

    return transaction;        
}

Util.prototype.createUpdateTransaction = function (contractAddress, abi, fnName, params) {
    var payloadData = this.encodeFunctionParams(contractAddress, abi, fnName, params);

    let transaction = {
        to: contractAddress,
        gasPrice: 0,
        gasLimit: 3000000,
        data: payloadData
    };

    return transaction;        
}

Util.prototype.raiseHttpRequest = async function(host, port, path, method, data, timeout) {
    var jsonPaylod = JSON.stringify(data);
    //console.log("jsonPaylod", jsonPaylod);

    // An object of options to indicate where to post to
    var post_options = {
        host: host, 
        port: port, 
        path: path, 
        method: method, 
        timeout: timeout || 10000,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(jsonPaylod)
        }
    };
    //console.log("post_options", post_options);        
    // send the request
    var response = await this.httpRequest(post_options, jsonPaylod);
    //console.log("Http response", response);
    return response;
}

Util.prototype.httpRequest = async function(params, postData) {
    return new Promise(function (resolve, reject) {
    var req = http.request(params, function (res) {
        // reject on bad status
        if (res.statusCode < 200 || res.statusCode >= 300) {
            return reject(new Error('statusCode=' + res.statusCode));
        }
        // cumulate data
        var body = [];
        res.on('data', function (chunk) {
            body.push(chunk);
        });
        // resolve on end
        res.on('end', function () {
            try {
                body = JSON.parse(Buffer.concat(body).toString());
            } catch (e) {
                console.log(new Date(), "Error", e);
                reject(e);
            }
            resolve(body);
        });
    });
    // reject on request error
    req.on('error', function (err) {
        reject(err);
    });
    if (postData) {
        req.write(postData);
    }
    // IMPORTANT
    req.end();
    });
}

var util = new Util();
module.exports = util;