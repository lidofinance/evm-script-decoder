import { EVMScriptDecoded, EVMScriptEncoded } from './types';
import { MethodABIProviderConfig } from './MethodABIProvider';
interface EVMScriptCallInput {
    address: string;
    params?: any[];
    method: string;
}
export declare class EVMScriptDecoder {
    private readonly methodABIProvider;
    constructor(config?: MethodABIProviderConfig);
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
