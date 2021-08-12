import keccak256 from 'keccak256'
import { ABICache } from './ABICache'
import { ABIElement, ABIProvider, Address, MethodInfo } from './types'

export class MethodABIProvider {
  private readonly cache: ABICache
  private readonly abiProviders: ABIProvider[]

  constructor(providers: ABIProvider[]) {
    this.abiProviders = providers
    this.cache = new ABICache()
  }

  async retrieveMethodABI(
    address: Address,
    { methodId, signature, methodName }: MethodInfo
  ): Promise<ABIElement | undefined> {
    const contractABI = await this.retrieveContractABI(address)
    if (methodId) {
      return contractABI[methodId]
    } else if (signature) {
      const methodId = '0x' + keccak256(signature).toString('hex').slice(0, 8)
      return contractABI[methodId]
    } else if (methodName) {
      return Object.values(contractABI).find((abi) => abi.name === methodName)
    }
    throw new Error('Invalid MethodInfo')
  }

  private async retrieveContractABI(address: Address) {
    const normalizedAddress = address.toLowerCase()
    if (this.cache.has(normalizedAddress)) {
      return this.cache.get(normalizedAddress)
    }
    let abi = await this.getContractABI(normalizedAddress)
    this.cache.add(normalizedAddress, abi || [])
    return this.cache.get(normalizedAddress)
  }

  private async getContractABI(contract: Address) {
    for (const provider of this.abiProviders) {
      try {
        const abi = await provider.getABI(contract)
        return abi
      } catch (error) {}
    }
  }
}
