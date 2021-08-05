import { ABIProviderEtherscan } from './ABIProviderEtherscan';
import { ABIProviderLocal } from './ABIProviderLocal';
export * from './EVMScriptDecoder';
export * from './EVMScriptParser';
export declare const providers: {
    Etherscan: typeof ABIProviderEtherscan;
    Local: typeof ABIProviderLocal;
};
