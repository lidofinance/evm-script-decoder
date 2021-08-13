import { ABIProviderRemote } from './ABIProviderRemote';
import { ABIElement, ABIProvider, Network, Fetcher } from './types';
export interface MiddlewareContext {
    abiProvider: ABIProvider;
    address: string;
    abi: ABIElement[];
}
interface ABIProviderMiddleware {
    (ctx: MiddlewareContext): Promise<ABIElement[]>;
}
interface ABIProviderEtherscanConfig {
    apiKey: string;
    network?: Network;
    fetch?: Fetcher;
    middlewares?: ABIProviderMiddleware[];
}
export declare class ABIProviderEtherscan extends ABIProviderRemote {
    constructor(config: ABIProviderEtherscanConfig);
}
export {};
