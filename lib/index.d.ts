import { ABIProviderEtherscan } from './ABIProviderEtherscan';
import { ABIProviderLocal } from './ABIProviderLocal';
import { ABIProviderRemote } from './ABIProviderRemote';
import { ProxyABIMiddleware } from './ProxyABIMiddleware';
export * from './EVMScriptDecoder';
export * from './EVMScriptParser';
export { DefaultImplMethodNames } from './ProxyABIMiddleware';
export declare const providers: {
    Etherscan: typeof ABIProviderEtherscan;
    Local: typeof ABIProviderLocal;
    Remote: typeof ABIProviderRemote;
};
export declare const middlewares: {
    ProxyABIMiddleware: typeof ProxyABIMiddleware;
};
