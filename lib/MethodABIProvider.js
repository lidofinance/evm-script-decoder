"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MethodABIProvider = void 0;
const keccak256_1 = __importDefault(require("keccak256"));
const ABICache_1 = require("./ABICache");
const ABIProvider_1 = require("./ABIProvider");
const ABIProviderStrategyEtherscan_1 = require("./ABIProviderStrategyEtherscan");
const ABIProviderStrategyLocal_1 = require("./ABIProviderStrategyLocal");
class MethodABIProvider {
    constructor({ abi, etherscanApiKey, network }) {
        this.abiProvider = new ABIProvider_1.ABIProvider();
        if (abi) {
            this.abiProvider.addStrategy(new ABIProviderStrategyLocal_1.ABIProviderStrategyLocal(abi));
        }
        if (etherscanApiKey) {
            this.abiProvider.addStrategy(new ABIProviderStrategyEtherscan_1.ABIProviderStrategyEtherscan(network || 'mainnet', etherscanApiKey));
        }
        this.cache = new ABICache_1.ABICache();
    }
    async retrieveMethodABI({ address, method }) {
        const contractABI = await this.retrieveContractABI(address);
        switch (typeOfMethodInfo(method)) {
            case 'id':
                return contractABI[method];
            case 'signature':
                const methodId = '0x' + keccak256_1.default(method).toString('hex').slice(0, 8);
                return contractABI[methodId];
            case 'name':
                return Object.values(contractABI).find((abi) => abi.name === method);
        }
    }
    async retrieveContractABI(address) {
        const normalizedAddress = address.toLowerCase();
        if (this.cache.has(normalizedAddress)) {
            return this.cache.get(normalizedAddress);
        }
        let abi = await this.abiProvider.getABI(normalizedAddress);
        this.cache.add(normalizedAddress, abi || []);
        return this.cache.get(normalizedAddress);
    }
}
exports.MethodABIProvider = MethodABIProvider;
function typeOfMethodInfo(method) {
    const signatureRegex = /([a-zA-Z0-9]+)\([a-zA-Z0-9,]*\)/gi;
    if (signatureRegex.test(method)) {
        return 'signature';
    }
    if (method.length === 10 && method.startsWith('0x')) {
        return 'id';
    }
    return 'name';
}
