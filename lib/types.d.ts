import nodeFetch from 'node-fetch';
export declare type Address = string;
export declare type EVMScriptEncoded = string;
export declare type ABIElement = {
    type: 'function' | 'event' | 'constructor' | 'fallback';
    name: string;
    inputs: ABIElementInputOutput[];
    outputs: ABIElementInputOutput[];
    stateMutability: 'pure' | 'view' | 'nonpayable' | 'payable';
    payable?: boolean;
    constant?: boolean;
};
interface ABIElementInputOutput {
    name: string;
    type: string;
    internalType?: string;
    components?: {
        name: string;
        type: string;
    }[];
}
export interface EVMScriptDecoded {
    specId: string;
    calls: EVMScriptCall[];
}
export interface EVMScriptParsed {
    address: string;
    methodId: string;
    callDataLength: number;
    encodedCallData: string;
}
export interface EVMScriptCall extends EVMScriptParsed {
    decodedCallData?: any[];
    abi?: ABIElement;
}
export interface ABIProviderStrategy {
    getABI(contract: Address): Promise<ABIElement[]>;
}
declare global {
    var fetch: typeof nodeFetch;
}
export {};
