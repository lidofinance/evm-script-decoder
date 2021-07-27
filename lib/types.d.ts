import nodeFetch from 'node-fetch';
export declare type Address = string;
export declare type EVMScriptEncoded = string;
export declare type ABIElement = {
    constant: boolean;
    inputs: any[];
    name: string;
    outputs: any[];
    payable: boolean;
    stateMutability: 'view' | 'nonpayable';
    type: 'function' | 'event';
};
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
