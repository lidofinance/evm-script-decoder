import { ABIElement, ABIProvider, Network, Fetcher } from './types';
export declare class ABIProviderEtherscan implements ABIProvider {
    readonly etherscanApiKey: string;
    readonly network: Network;
    private readonly fetch?;
    constructor(network: Network, etherscanApiKey: string, fetcher?: Fetcher);
    getABI(contract: string): Promise<ABIElement[]>;
    private get baseEtherscanApiUrl();
}
