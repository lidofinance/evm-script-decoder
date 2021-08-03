import { ABIElement, Address } from './types';
export declare class ABICache {
    private readonly data;
    has(address: string): boolean;
    get(contract: Address): Record<string, ABIElement> | undefined;
    add(address: string, abi: ABIElement[]): void;
}
