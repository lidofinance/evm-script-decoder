import { ABIProviderMiddlewareContext } from './ABIProvider';
import { ABIElement, Address } from './types';
interface ProxyABIMiddlewareConfig {
    implMethodNames?: string[];
    loadImplAddress(proxyAddress: Address, implMethodAbi: ABIElement): Promise<Address | undefined>;
}
export declare function ProxyABIMiddleware(config: ProxyABIMiddlewareConfig): (ctx: ABIProviderMiddlewareContext) => Promise<ABIElement[]>;
export declare namespace ProxyABIMiddleware {
    var DefaultImplMethodNames: readonly string[];
}
export {};
