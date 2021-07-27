import { ABIElement, ABIProviderStrategy } from './types'

export class ABIProviderStrategyLocal implements ABIProviderStrategy {
  private readonly abis: Record<string, ABIElement[]>
  constructor(abis: Record<string, ABIElement[]>) {
    this.abis = abis
  }
  async getABI(contract: string): Promise<ABIElement[]> {
    if (!this.abis[contract]) {
      throw new Error(`ABI for contract ${contract} wasn't provided`)
    }
    return this.abis[contract]
  }
}
