"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MethodABIProvider = void 0;
const keccak256_1 = __importDefault(require("keccak256"));
const ABICache_1 = require("./ABICache");
class MethodABIProvider {
    constructor(providers) {
        this.abiProviders = providers;
        this.cache = new ABICache_1.ABICache();
    }
    async retrieveMethodABI(address, { methodId, signature, methodName }) {
        const contractABI = await this.retrieveContractABI(address);
        if (methodId) {
            return contractABI[methodId];
        }
        else if (signature) {
            const methodId = '0x' + keccak256_1.default(signature).toString('hex').slice(0, 8);
            return contractABI[methodId];
        }
        else if (methodName) {
            return Object.values(contractABI).find((abi) => abi.name === methodName);
        }
        throw new Error('Invalid method info');
    }
    async retrieveContractABI(address) {
        const normalizedAddress = address.toLowerCase();
        if (this.cache.has(normalizedAddress)) {
            return this.cache.get(normalizedAddress);
        }
        let abi = await this.getContractABI(normalizedAddress);
        this.cache.add(normalizedAddress, abi || []);
        return this.cache.get(normalizedAddress);
    }
    async getContractABI(contract) {
        for (const provider of this.abiProviders) {
            try {
                const abi = await provider.getABI(contract);
                return abi;
            }
            catch (error) { }
        }
    }
}
exports.MethodABIProvider = MethodABIProvider;
