import { URLSearchParams } from 'url'
import { ABIElement, ABIProviderStrategy, Network } from './types'

export class ABIProviderStrategyEtherscan implements ABIProviderStrategy {
  public readonly etherscanApiKey: string
  public readonly network: Network

  constructor(network: Network, etherscanApiKey: string) {
    this.etherscanApiKey = etherscanApiKey
    this.network = network
  }
  async getABI(contract: string): Promise<ABIElement[]> {
    const queryParams = new URLSearchParams({
      module: 'contract',
      action: 'getabi',
      address: contract,
      apikey: this.etherscanApiKey,
    })
    const response = await fetch(`${this.baseEtherscanApiUrl}?${queryParams.toString()}`)
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
