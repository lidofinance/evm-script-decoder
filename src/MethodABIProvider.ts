import keccak256 from 'keccak256'
import { ABICache } from './ABICache'
import { ABIElement, ABIProvider, Address } from './types'

interface MethodInfo {
  address: Address
  method: string
}

export class MethodABIProvider {
  private readonly cache: ABICache
  private readonly abiProviders: ABIProvider[]

  constructor(providers: ABIProvider[]) {
    this.abiProviders = providers
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
