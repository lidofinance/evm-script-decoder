import { ABIElement, ABIProvider } from './types';
export declare class ABIProviderLocal implements ABIProvider {
    private readonly abis;
    constructor(abiByAddress: Record<string, ABIElement[]>);
    getABI(address: string): Promise<ABIElement[]>;
}
