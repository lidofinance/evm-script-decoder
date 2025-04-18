import { ABIElement, Address } from './types'
import { getMethodId, getMethodSignature } from './utils'

export class ABICache {
  // stores ABI elements by address by methodId
  private readonly data: Record<string, Record<string, ABIElement>> = {}

  has(address: string): boolean {
    return !!this.data[address]
  }

  get(contract: Address): Record<string, ABIElement> | undefined {
    return this.data[contract]
  }

  add(address: string, abi: ABIElement[]) {
    const abiByMethodIds: Record<string, ABIElement> = {}
    const onlyMethodsABI = abi.filter((a) => a.name && a.inputs)
    for (const abiElement of onlyMethodsABI) {
      const signature = getMethodSignature(abiElement)
      const methodId = getMethodId(signature)
      abiByMethodIds[methodId] = abiElement
    }
    this.data[address] = abiByMethodIds
  }
}
