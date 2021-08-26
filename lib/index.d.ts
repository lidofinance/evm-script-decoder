import { ABIProviderEtherscan } from './ABIProviderEtherscan';
import { ABIProviderLocal } from './ABIProviderLocal';
import { ABIProvider, ABIProviderMiddleware, ABIProviderMiddlewareContext } from './ABIProvider';
import { ProxyABIMiddleware } from './ProxyABIMiddleware';
export * from './EVMScriptDecoder';
export * from './EVMScriptParser';
export declare const abiProviders: {
    Base: typeof ABIProvider;
    Local: typeof ABIProviderLocal;
    Etherscan: typeof ABIProviderEtherscan;
    middlewares: {
        ProxyABIMiddleware: typeof ProxyABIMiddleware;
    };
};
export { ABIProviderMiddleware, ABIProviderMiddlewareContext };
