import { ABIElement, ABIProvider, Address, MethodInfo } from './types';
export declare class MethodABIProvider {
    private readonly cache;
    private readonly abiProviders;
    constructor(providers: ABIProvider[]);
    retrieveMethodABI(address: Address, { methodId, signature, methodName }: MethodInfo): Promise<ABIElement | undefined>;
    private retrieveContractABI;
    private getContractABI;
}
