import keccak256 from 'keccak256'
import { ABICache } from './ABICache'
import { ABIProvider } from './ABIProvider'
import { ABIProviderStrategyEtherscan } from './ABIProviderStrategyEtherscan'
import { ABIProviderStrategyLocal } from './ABIProviderStrategyLocal'
import { ABIElement, Address } from './types'

type MethodName = { method: string }
type MethodId = { methodId: string }
type MethodSignature = { signature: string }
type MethodInfo = MethodName | MethodId | MethodSignature

interface MethodABIProviderConfig {
  etherscanApiKey?: string
  abi?: Record<Address, ABIElement[]>
  network?: 'mainnet' | 'rinkeby' | 'goerli' | 'kovan'
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

  async retrieveMethodABI(
    address: string,
    methodInfo: MethodInfo
  ): Promise<ABIElement | undefined> {
    const contractABI = await this.retrieveContractABI(address)
    if (isMethodId(methodInfo)) {
      return contractABI[methodInfo.methodId]
    } else if (isMethodSignature(methodInfo)) {
      const methodId = '0x' + keccak256(methodInfo.signature).toString('hex').slice(0, 8)
      return contractABI[methodId]
    } else if (isMethodName(methodInfo)) {
      return Object.values(contractABI).find((abi) => abi.name === methodInfo.method)
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

function isMethodId(methodInfo: MethodInfo): methodInfo is MethodId {
  return !!(methodInfo as MethodId).methodId
}

function isMethodName(methodInfo: MethodInfo): methodInfo is MethodName {
  return !!(methodInfo as MethodName).method
}

function isMethodSignature(methodInfo: MethodInfo): methodInfo is MethodSignature {
  return !!(methodInfo as MethodSignature).signature
}
