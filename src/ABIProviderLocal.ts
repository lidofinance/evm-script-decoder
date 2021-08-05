import { ABIElement, ABIProvider } from './types'

export class ABIProviderLocal implements ABIProvider {
  private readonly abis: Record<string, ABIElement[]> = {}
  constructor(abiByAddress: Record<string, ABIElement[]>) {
    for (const [address, abi] of Object.entries(abiByAddress)) {
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
