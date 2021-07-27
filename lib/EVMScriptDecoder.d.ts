import { ABIElement, Address, EVMScriptDecoded, EVMScriptEncoded } from './types';
interface EVMScriptDecoderConfig {
    etherscanApiKey?: string;
    abi?: Record<Address, ABIElement[]>;
}
export declare class EVMScriptDecoder {
    private readonly abiProvider;
    private readonly cache;
    constructor({ etherscanApiKey, abi }?: EVMScriptDecoderConfig);
    decodeEVMScript(evmScript: EVMScriptEncoded): Promise<EVMScriptDecoded>;
    private retrieveABI;
    private decodeFunctionData;
}
export {};
