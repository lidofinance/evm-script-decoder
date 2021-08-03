import { ABIElement, Address, EVMScriptDecoded, EVMScriptEncoded } from './types';
interface EVMScriptDecoderConfig {
    etherscanApiKey?: string;
    abi?: Record<Address, ABIElement[]>;
}
interface EVMScriptCallInput {
    address: string;
    params?: any[];
    method: string;
}
export declare class EVMScriptDecoder {
    private readonly methodABIProvider;
    constructor({ etherscanApiKey, abi }?: EVMScriptDecoderConfig);
    decodeEVMScript(evmScript: EVMScriptEncoded): Promise<EVMScriptDecoded>;
    encodeEVMScript(address: string, method: string, params: any[], specId?: string): Promise<EVMScriptEncoded>;
    encodeEVMScript(address: string, calls: {
        method: string;
        params: any[];
    }[], specId?: string): Promise<EVMScriptEncoded>;
    encodeEVMScript(calls: EVMScriptCallInput[], specId?: string): Promise<EVMScriptEncoded>;
    private encodeEVMScriptOneCall;
    private encodeEVMScriptOneAddressManyCalls;
    private encodeEVMScriptDifferentCalls;
    private encodeFunctionData;
    private decodeFunctionData;
}
export {};
