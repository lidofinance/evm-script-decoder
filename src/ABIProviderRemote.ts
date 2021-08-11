import { ABIElement, ABIProvider, Network, Fetcher, Address } from './types'

export interface MiddlewareContext {
  abiProvider: ABIProvider
  address: string
  abi: ABIElement[]
}

interface ABIProviderMiddleware {
  (ctx: MiddlewareContext): Promise<ABIElement[]>
}

interface ABIFetcher {
  (address: Address): Promise<ABIElement[]>
}

interface ABIProviderRemoteConfig {
  fetcher: ABIFetcher
  middlewares?: ABIProviderMiddleware[]
}

export class ABIProviderRemote implements ABIProvider {
  private readonly fetcher: ABIFetcher
  private readonly middlewares: ABIProviderMiddleware[]

  constructor(config: ABIProviderRemoteConfig) {
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
