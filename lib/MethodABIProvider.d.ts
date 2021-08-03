import { ABIElement, Address } from './types';
interface MethodInfo {
    address: Address;
    method: string;
}
interface MethodABIProviderConfig {
    etherscanApiKey?: string;
    abi?: Record<Address, ABIElement[]>;
    network?: 'mainnet' | 'rinkeby' | 'goerli' | 'kovan';
}
export declare class MethodABIProvider {
    private readonly cache;
    private readonly abiProvider;
    constructor({ abi, etherscanApiKey }: MethodABIProviderConfig);
    retrieveMethodABI({ address, method }: MethodInfo): Promise<ABIElement | undefined>;
    private retrieveContractABI;
}
export {};
