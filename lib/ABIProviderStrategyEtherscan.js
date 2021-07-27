"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ABIProviderStrategyEtherscan = void 0;
const url_1 = require("url");
class ABIProviderStrategyEtherscan {
    constructor(etherscanApiKey) {
        this.etherscanApiKey = etherscanApiKey;
    }
    async getABI(contract) {
        const queryParams = new url_1.URLSearchParams({
            module: 'contract',
            action: 'getabi',
            address: contract,
            apikey: this.etherscanApiKey,
        }).toString();
        const getAbiUrl = `https://api-rinkeby.etherscan.io/api?${queryParams}`;
        const response = await fetch(getAbiUrl);
        if (response.status !== 200) {
            throw Error(`Etherscan request failed. Status code ${response.status}`);
        }
        const data = await response.json();
        if (data.message != 'OK') {
            throw new Error(data.result);
        }
        return JSON.parse(data.result);
    }
}
exports.ABIProviderStrategyEtherscan = ABIProviderStrategyEtherscan;
