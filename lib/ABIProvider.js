"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ABIProvider = void 0;
class ABIProvider {
    constructor() {
        this.abiProviderStrategies = [];
    }
    addStrategy(strategy) {
        this.abiProviderStrategies.push(strategy);
    }
    async getABI(contract) {
        for (const strategy of this.abiProviderStrategies) {
            try {
                const abi = await strategy.getABI(contract);
                return abi;
            }
            catch (error) { }
        }
    }
}
exports.ABIProvider = ABIProvider;
