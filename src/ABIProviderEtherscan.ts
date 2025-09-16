import { ABIProvider, ABIProviderMiddleware } from './ABIProvider'
import { Network, Fetcher, Address } from './types'

interface EtherscanResponse {
  message: 'OK' | 'NOTOK'
  result: string
}

interface ABIProviderEtherscanConfig {
  apiKey: string
  /** @deprecated Use `chainId` instead. */
  network?: Network
  chainId?: number
  fetch?: Fetcher
  middlewares?: ABIProviderMiddleware[]
}

export class ABIProviderEtherscan extends ABIProvider {
  constructor(config: ABIProviderEtherscanConfig) {
    super({
      fetcher: DefaultEtherscanFetcher({
        fetch: config.fetch || globalThis.fetch.bind(globalThis),
        apiKey: config.apiKey,
        chainId: config.chainId,
      }),
      middlewares: config.middlewares,
    })
  }
}

function DefaultEtherscanFetcher(config: { apiKey: string; chainId?: number; fetch: Fetcher }) {
  return async (address: Address) => {
    const queryParams = [
      `chainid=${config.chainId ?? 1}`,
      'module=contract',
      'action=getabi',
      `address=${address}`,
      `apikey=${config.apiKey}`,
    ]

    const response = await config.fetch(`https://api.etherscan.io/v2/api?${queryParams.join('&')}`)
    if (response.status !== 200) {
      throw Error(`Etherscan request failed. Status code ${response.status}`)
    }
    const data: EtherscanResponse = await response.json()
    if (data.message != 'OK') {
      throw new Error(data.result)
    }
    return JSON.parse(data.result)
  }
}
