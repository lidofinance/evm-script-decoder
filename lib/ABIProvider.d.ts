import { ABIElement, ABIProviderStrategy } from './types';
export declare class ABIProvider {
    private readonly abiProviderStrategies;
    addStrategy(strategy: ABIProviderStrategy): void;
    getABI(contract: string): Promise<ABIElement[] | undefined>;
}
