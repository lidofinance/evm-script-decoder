import { ABIElement, Address } from './types'

export interface ABIProviderMiddlewareContext {
  abiProvider: ABIProvider
  address: string
  abi: ABIElement[]
}

export interface ABIProviderMiddleware {
  (ctx: ABIProviderMiddlewareContext): Promise<ABIElement[]>
}

interface ABIFetcher {
  (address: Address): Promise<ABIElement[]>
}

interface ABIProviderConfig {
  fetcher: ABIFetcher
  middlewares?: ABIProviderMiddleware[]
}

export class ABIProvider {
  private readonly fetcher: ABIFetcher
  private readonly middlewares: ABIProviderMiddleware[]

  constructor(config: ABIProviderConfig) {
    this.fetcher = config.fetcher
    this.middlewares = config.middlewares || []
  }

  async getABI(contract: string): Promise<ABIElement[]> {
    let abi = await this.fetcher(contract)
    for (const middleware of this.middlewares) {
      abi = await middleware({ address: contract, abi, abiProvider: this })
    }
    return abi
  }
}
