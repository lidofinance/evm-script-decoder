import { ABIProvider, ABIProviderMiddleware } from './ABIProvider'
import { Network, Fetcher, Address } from './types'

interface EtherscanResponse {
  message: 'OK' | 'NOTOK'
  result: string
}

interface ABIProviderEtherscanConfig {
  apiKey: string
  network?: Network
  fetch?: Fetcher
  middlewares?: ABIProviderMiddleware[]
}

export class ABIProviderEtherscan extends ABIProvider {
  constructor(config: ABIProviderEtherscanConfig) {
    super({
      fetcher: DefaultEtherscanFetcher({
        fetch: config.fetch || globalThis.fetch.bind(globalThis),
        apiKey: config.apiKey,
        network: config.network || 'mainnet',
      }),
      middlewares: config.middlewares,
    })
  }
}

function DefaultEtherscanFetcher(config: { network: Network; apiKey: String; fetch: Fetcher }) {
  return async (address: Address) => {
    const queryParams = [
      'module=contract',
      'action=getabi',
      `address=${address}`,
      `apikey=${config.apiKey}`,
    ]
    const baseApiUrl =
      config.network === 'mainnet'
        ? 'https://api.etherscan.io/api'
        : `https://api-${config.network}.etherscan.io/api`
    const response = await config.fetch(`${baseApiUrl}?${queryParams.join('&')}`)
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
