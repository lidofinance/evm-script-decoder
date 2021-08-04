import { ABIElement, Address, Network } from './types';
interface MethodInfo {
    address: Address;
    method: string;
}
export interface MethodABIProviderConfig {
    etherscanApiKey?: string;
    network?: Network;
    abi?: Record<Address, ABIElement[]>;
}
export declare class MethodABIProvider {
    private readonly cache;
    private readonly abiProvider;
    constructor({ abi, etherscanApiKey, network }: MethodABIProviderConfig);
    retrieveMethodABI({ address, method }: MethodInfo): Promise<ABIElement | undefined>;
    private retrieveContractABI;
}
export {};
