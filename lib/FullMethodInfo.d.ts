import { ABIElement, Address } from './types';
export declare class FullMethodInfo {
    signature: string;
    address: Address;
    params: string[];
    methodId: string;
    abi?: ABIElement;
    static fromABI(address: Address, abi: ABIElement): FullMethodInfo;
    static fromSignature(address: Address, signature: string): FullMethodInfo;
    constructor(address: Address, signature: string, abi?: ABIElement);
    encodeMethodParams(decodedParams: any[]): string;
    decodeMethodParams(encodedParams: string): any;
}
