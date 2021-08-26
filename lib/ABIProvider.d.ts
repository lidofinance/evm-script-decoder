import { ABIElement, Address } from './types';
export interface ABIProviderMiddlewareContext {
    abiProvider: ABIProvider;
    address: string;
    abi: ABIElement[];
}
export interface ABIProviderMiddleware {
    (ctx: ABIProviderMiddlewareContext): Promise<ABIElement[]>;
}
interface ABIFetcher {
    (address: Address): Promise<ABIElement[]>;
}
interface ABIProviderConfig {
    fetcher: ABIFetcher;
    middlewares?: ABIProviderMiddleware[];
}
export declare class ABIProvider {
    private readonly fetcher;
    private readonly middlewares;
    constructor(config: ABIProviderConfig);
    getABI(contract: string): Promise<ABIElement[]>;
}
export {};
