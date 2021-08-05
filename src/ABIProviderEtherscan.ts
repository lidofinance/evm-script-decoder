import { ABIElement, ABIProvider, Network, Fetcher } from './types'

export class ABIProviderEtherscan implements ABIProvider {
  public readonly etherscanApiKey: string
  public readonly network: Network
  private readonly fetch?: Fetcher

  constructor(network: Network, etherscanApiKey: string, fetcher: Fetcher = fetch) {
    this.etherscanApiKey = etherscanApiKey
    this.network = network
    this.fetch = fetcher
  }
  async getABI(contract: string): Promise<ABIElement[]> {
    const queryParams = [
      'module=contract',
      'action=getabi',
      `address=${contract}`,
      `apikey=${this.etherscanApiKey}`,
    ].join('&')
    const response = await this.fetch(`${this.baseEtherscanApiUrl}?${queryParams}`)
    if (response.status !== 200) {
      throw Error(`Etherscan request failed. Status code ${response.status}`)
    }
    const data = await response.json()
    if (data.message != 'OK') {
      throw new Error(data.result)
    }
    return JSON.parse(data.result)
  }

  private get baseEtherscanApiUrl() {
    if (this.network === 'mainnet') {
      return `https://api.etherscan.io/api`
    }
    return `https://api-${this.network}.etherscan.io/api`
  }
}
