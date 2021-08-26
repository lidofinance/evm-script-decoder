"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ABIProviderEtherscan = void 0;
const ABIProvider_1 = require("./ABIProvider");
class ABIProviderEtherscan extends ABIProvider_1.ABIProvider {
    constructor(config) {
        super({
            fetcher: DefaultEtherscanFetcher({
                fetch: config.fetch || globalThis.fetch.bind(globalThis),
                apiKey: config.apiKey,
                network: config.network || 'mainnet',
            }),
            middlewares: config.middlewares,
        });
    }
}
exports.ABIProviderEtherscan = ABIProviderEtherscan;
function DefaultEtherscanFetcher(config) {
    return async (address) => {
        const queryParams = [
            'module=contract',
            'action=getabi',
            `address=${address}`,
            `apikey=${config.apiKey}`,
        ];
        const baseApiUrl = config.network === 'mainnet'
            ? 'https://api.etherscan.io/api'
            : `https://api-${config.network}.etherscan.io/api`;
        const response = await config.fetch(`${baseApiUrl}?${queryParams.join('&')}`);
        if (response.status !== 200) {
            throw Error(`Etherscan request failed. Status code ${response.status}`);
        }
        const data = await response.json();
        if (data.message != 'OK') {
            throw new Error(data.result);
        }
        return JSON.parse(data.result);
    };
}
