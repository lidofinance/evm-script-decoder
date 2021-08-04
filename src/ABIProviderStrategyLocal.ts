import { ABIElement, ABIProviderStrategy } from './types'

export class ABIProviderStrategyLocal implements ABIProviderStrategy {
  private readonly abis: Record<string, ABIElement[]> = {}
  constructor(abis: Record<string, ABIElement[]>) {
    for (const [address, abi] of Object.entries(abis)) {
      this.abis[address.toLowerCase()] = abi
    }
  }

  async getABI(address: string): Promise<ABIElement[]> {
    if (!this.abis[address]) {
      throw new Error(`ABI for contract ${address} wasn't provided`)
    }
    return this.abis[address]
  }
}
