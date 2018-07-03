var coder = require("./node_modules/web3/lib/solidity/coder");
//var web3 = require("web3");
var _ = require('lodash');
var SolidityFunction = require('web3/lib/web3/function');

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

var util = new Util();
module.exports = util;