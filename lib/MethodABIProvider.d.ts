import { ABIElement, ABIProvider, Address } from './types';
interface MethodInfo {
    address: Address;
    method: string;
}
export declare class MethodABIProvider {
    private readonly cache;
    private readonly abiProviders;
    constructor(providers: ABIProvider[]);
    retrieveMethodABI({ address, method }: MethodInfo): Promise<ABIElement | undefined>;
    private retrieveContractABI;
    private getContractABI;
}
export {};
