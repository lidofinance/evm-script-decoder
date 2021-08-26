import { ABIProvider, ABIProviderMiddleware } from './ABIProvider';
import { Network, Fetcher } from './types';
interface ABIProviderEtherscanConfig {
    apiKey: string;
    network?: Network;
    fetch?: Fetcher;
    middlewares?: ABIProviderMiddleware[];
}
export declare class ABIProviderEtherscan extends ABIProvider {
    constructor(config: ABIProviderEtherscanConfig);
}
export {};
