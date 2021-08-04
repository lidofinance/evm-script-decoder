"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ABIProviderStrategyEtherscan = void 0;
const url_1 = require("url");
class ABIProviderStrategyEtherscan {
    constructor(network, etherscanApiKey) {
        this.etherscanApiKey = etherscanApiKey;
        this.network = network;
    }
    async getABI(contract) {
        const queryParams = new url_1.URLSearchParams({
            module: 'contract',
            action: 'getabi',
            address: contract,
            apikey: this.etherscanApiKey,
        });
        const response = await fetch(`${this.baseEtherscanApiUrl}?${queryParams.toString()}`);
        if (response.status !== 200) {
            throw Error(`Etherscan request failed. Status code ${response.status}`);
        }
        const data = await response.json();
        if (data.message != 'OK') {
            throw new Error(data.result);
        }
        return JSON.parse(data.result);
    }
    get baseEtherscanApiUrl() {
        if (this.network === 'mainnet') {
            return `https://api.etherscan.io/api`;
        }
        return `https://api-${this.network}.etherscan.io/api`;
    }
}
exports.ABIProviderStrategyEtherscan = ABIProviderStrategyEtherscan;
