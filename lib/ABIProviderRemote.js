"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ABIProviderRemote = void 0;
class ABIProviderRemote {
    constructor(config) {
        this.fetcher = config.fetcher;
        this.middlewares = config.middlewares || [];
    }
    async getABI(contract) {
        let abi = await this.fetcher(contract);
        for (const middleware of this.middlewares) {
            abi = await middleware({ address: contract, abi, abiProvider: this });
        }
        return abi;
    }
}
exports.ABIProviderRemote = ABIProviderRemote;
