import { ABIElement } from './types';
export declare class ABICache {
    private readonly data;
    has(address: string, methodId: string): boolean;
    get(address: string, methodId: string): ABIElement | undefined;
    add(address: string, abi: ABIElement[]): void;
}
