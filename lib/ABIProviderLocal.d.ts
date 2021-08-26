import { ABIProvider } from './ABIProvider';
import { ABIElement } from './types';
export declare class ABIProviderLocal extends ABIProvider {
    constructor(abiByAddress: Record<string, ABIElement[]>);
}
