import { ABIElement, ABIProviderStrategy, Network } from './types';
export declare class ABIProviderStrategyEtherscan implements ABIProviderStrategy {
    readonly etherscanApiKey: string;
    readonly network: Network;
    constructor(network: Network, etherscanApiKey: string);
    getABI(contract: string): Promise<ABIElement[]>;
    private get baseEtherscanApiUrl();
}
