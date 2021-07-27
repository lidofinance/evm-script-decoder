"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ABIProviderStrategyLocal = void 0;
class ABIProviderStrategyLocal {
    constructor(abis) {
        this.abis = abis;
    }
    async getABI(contract) {
        if (!this.abis[contract]) {
            throw new Error(`ABI for contract ${contract} wasn't provided`);
        }
        return this.abis[contract];
    }
}
exports.ABIProviderStrategyLocal = ABIProviderStrategyLocal;
