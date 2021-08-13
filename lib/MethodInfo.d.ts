import { ABIElement, Address } from './types';
export declare class SignatureMethodInfo {
    signature: string;
    address: Address;
    params: string[];
    methodId: string;
    constructor(address: Address, signature: string);
    encodeMethodParams(decodedParams: any[]): string;
    decodeMethodParams(encodedParams: string): any;
}
export declare class ABIMethodInfo extends SignatureMethodInfo {
    abi: ABIElement;
    constructor(address: Address, abi: ABIElement);
}
