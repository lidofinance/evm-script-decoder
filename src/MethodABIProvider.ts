import keccak256 from 'keccak256'
import { ABICache } from './ABICache'
import { ABIProvider } from './ABIProvider'
import { ABIProviderStrategyEtherscan } from './ABIProviderStrategyEtherscan'
import { ABIProviderStrategyLocal } from './ABIProviderStrategyLocal'
import { ABIElement, Address } from './types'

interface MethodInfo {
  address: Address
  method: string
}
interface MethodABIProviderConfig {
  etherscanApiKey?: string
  abi?: Record<Address, ABIElement[]>
  network?: 'mainnet' | 'rinkeby' | 'goerli' | 'kovan'
}

function typeOfMethodInfo(method: string): 'signature' | 'name' | 'id' {
  const signatureRegex = /([a-zA-Z0-9]+)\([a-zA-Z0-9,]*\)/gi
  if (signatureRegex.test(method)) {
    return 'signature'
  }

  if (method.length === 10 && method.startsWith('0x')) {
    return 'id'
  }
  return 'name'
}

export class MethodABIProvider {
  private readonly cache: ABICache
  private readonly abiProvider: ABIProvider

  constructor({ abi, etherscanApiKey }: MethodABIProviderConfig) {
    this.abiProvider = new ABIProvider()
    if (abi) {
      this.abiProvider.addStrategy(new ABIProviderStrategyLocal(abi))
    }
    if (etherscanApiKey) {
      this.abiProvider.addStrategy(new ABIProviderStrategyEtherscan(etherscanApiKey))
    }
    this.cache = new ABICache()
  }

  async retrieveMethodABI({ address, method }: MethodInfo): Promise<ABIElement | undefined> {
    const contractABI = await this.retrieveContractABI(address)
    switch (typeOfMethodInfo(method)) {
      case 'id':
        return contractABI[method]
      case 'signature':
        const methodId = '0x' + keccak256(method).toString('hex').slice(0, 8)
        return contractABI[methodId]
      case 'name':
        return Object.values(contractABI).find((abi) => abi.name === method)
    }
  }

  private async retrieveContractABI(address: Address) {
    if (this.cache.has(address)) {
      return this.cache.get(address)
    }
    let abi = await this.abiProvider.getABI(address)
    this.cache.add(address, abi || [])
    return this.cache.get(address)
  }
}
