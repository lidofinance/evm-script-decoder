"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVMScriptDecoder = void 0;
const ABICache_1 = require("./ABICache");
const ABIProvider_1 = require("./ABIProvider");
const abi_1 = require("@ethersproject/abi");
const EVMScriptParser_1 = require("./EVMScriptParser");
const ABIProviderStrategyLocal_1 = require("./ABIProviderStrategyLocal");
const ABIProviderStrategyEtherscan_1 = require("./ABIProviderStrategyEtherscan");
class EVMScriptDecoder {
    constructor({ etherscanApiKey, abi } = {}) {
        this.abiProvider = new ABIProvider_1.ABIProvider();
        if (abi) {
            this.abiProvider.addStrategy(new ABIProviderStrategyLocal_1.ABIProviderStrategyLocal(abi));
        }
        if (etherscanApiKey) {
            this.abiProvider.addStrategy(new ABIProviderStrategyEtherscan_1.ABIProviderStrategyEtherscan(etherscanApiKey));
        }
        this.cache = new ABICache_1.ABICache();
    }
    async decodeEVMScript(evmScript) {
        const parsedScript = EVMScriptParser_1.EVMScriptParser.parse(evmScript);
        for (const call of parsedScript.calls) {
            call.abi = await this.retrieveABI(call);
            call.decodedCallData = this.decodeFunctionData(call);
        }
        return parsedScript;
    }
    async retrieveABI(data) {
        if (this.cache.has(data.address, data.methodId)) {
            return this.cache.get(data.address, data.methodId);
        }
        let abi = await this.abiProvider.getABI(data.address);
        this.cache.add(data.address, abi || []);
        return this.cache.get(data.address, data.methodId);
    }
    decodeFunctionData(data) {
        const abi = this.cache.get(data.address, data.methodId);
        if (!abi) {
            return undefined;
        }
        const i = new abi_1.Interface(JSON.stringify([abi]));
        return Array.from(i.decodeFunctionData(abi.name, data.methodId + data.encodedCallData.substring(2)));
    }
}
exports.EVMScriptDecoder = EVMScriptDecoder;
