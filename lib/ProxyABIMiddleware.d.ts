import { MiddlewareContext } from './ABIProviderEtherscan';
import { ABIElement, Address } from './types';
interface ProxyABIMiddlewareConfig {
    implMethodNames?: string[];
    loadImplAddress(proxyAddress: Address, implMethodAbi: ABIElement): Promise<Address | undefined>;
}
export declare function ProxyABIMiddleware(config: ProxyABIMiddlewareConfig): (ctx: MiddlewareContext) => Promise<ABIElement[]>;
export declare const DefaultImplMethodNames: readonly string[];
export {};
