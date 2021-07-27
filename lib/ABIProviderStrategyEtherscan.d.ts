import { ABIElement, ABIProviderStrategy } from './types';
export declare class ABIProviderStrategyEtherscan implements ABIProviderStrategy {
    readonly etherscanApiKey: string;
    constructor(etherscanApiKey: string);
    getABI(contract: string): Promise<ABIElement[]>;
}
