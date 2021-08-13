import { ABIProvider, EVMScriptDecoded, EVMScriptEncoded, EVMScriptToEncode } from './types';
export declare class EVMScriptDecoder {
    private readonly methodABIProvider;
    constructor(providers?: ABIProvider[]);
    decodeEVMScript(evmScript: EVMScriptEncoded): Promise<EVMScriptDecoded>;
    encodeEVMScript(evmScript: EVMScriptToEncode): Promise<string>;
    private encodeEVMScriptCall;
    private getMethodInfo;
    private findMethodInfo;
}
