"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ABIProviderLocal = void 0;
class ABIProviderLocal {
    constructor(abiByAddress) {
        this.abis = {};
        for (const [address, abi] of Object.entries(abiByAddress)) {
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
exports.ABIProviderLocal = ABIProviderLocal;
