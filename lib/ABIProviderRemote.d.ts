import { ABIElement, ABIProvider, Address } from './types';
export interface MiddlewareContext {
    abiProvider: ABIProvider;
    address: string;
    abi: ABIElement[];
}
interface ABIProviderMiddleware {
    (ctx: MiddlewareContext): Promise<ABIElement[]>;
}
interface ABIFetcher {
    (address: Address): Promise<ABIElement[]>;
}
interface ABIProviderRemoteConfig {
    fetcher: ABIFetcher;
    middlewares?: ABIProviderMiddleware[];
}
export declare class ABIProviderRemote implements ABIProvider {
    private readonly fetcher;
    private readonly middlewares;
    constructor(config: ABIProviderRemoteConfig);
    getABI(contract: string): Promise<ABIElement[]>;
}
export {};
