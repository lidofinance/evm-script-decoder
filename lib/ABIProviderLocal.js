"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ABIProviderLocal = void 0;
const ABIProvider_1 = require("./ABIProvider");
class ABIProviderLocal extends ABIProvider_1.ABIProvider {
    constructor(abiByAddress) {
        super({
            fetcher: LocalFetcher(abiByAddress),
        });
    }
}
exports.ABIProviderLocal = ABIProviderLocal;
function LocalFetcher(abiByAddress) {
    const abis = {};
    for (const [address, abi] of Object.entries(abiByAddress)) {
        abis[address.toLowerCase()] = abi;
    }
    return async (address) => {
        if (!abis[address]) {
            throw new Error(`ABI for contract ${address} wasn't provided`);
        }
        return abis[address];
    };
}
