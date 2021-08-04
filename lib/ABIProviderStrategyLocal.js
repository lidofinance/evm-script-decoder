"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ABIProviderStrategyLocal = void 0;
class ABIProviderStrategyLocal {
    constructor(abis) {
        this.abis = {};
        for (const [address, abi] of Object.entries(abis)) {
            this.abis[address.toLowerCase()] = abi;
        }
    }
    async getABI(address) {
        if (!this.abis[address]) {
            throw new Error(`ABI for contract ${address} wasn't provided`);
        }
        return this.abis[address];
    }
}
exports.ABIProviderStrategyLocal = ABIProviderStrategyLocal;
