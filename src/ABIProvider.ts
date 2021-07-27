import { ABIElement, ABIProviderStrategy } from './types'

export class ABIProvider {
  private readonly abiProviderStrategies: ABIProviderStrategy[] = []

  addStrategy(strategy: ABIProviderStrategy) {
    this.abiProviderStrategies.push(strategy)
  }

  async getABI(contract: string): Promise<ABIElement[] | undefined> {
    for (const strategy of this.abiProviderStrategies) {
      try {
        return strategy.getABI(contract)
      } catch (error) {}
    }
  }
}
