import { ABIElement, ABIProviderStrategy } from './types';
export declare class ABIProviderStrategyLocal implements ABIProviderStrategy {
    private readonly abis;
    constructor(abis: Record<string, ABIElement[]>);
    getABI(contract: string): Promise<ABIElement[]>;
}