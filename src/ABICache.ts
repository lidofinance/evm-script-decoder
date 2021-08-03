import keccak256 from 'keccak256'
import { ABIElement, Address } from './types'

export class ABICache {
  // stores ABI elements by address by methodId
  private readonly data: Record<string, Record<string, ABIElement>> = {}

  hasContractABI(address: string): boolean {
    return !!this.data[address]
  }

  hasMethodABI(address: string, methodId: string): boolean {
    return !!(this.data[address] && this.data[address][methodId])
  }

  getContractABI(contract: Address): ABIElement[] | undefined {
    return Object.values(this.data[contract])
  }

  getMethodABI(address: string, methodId: string): ABIElement | undefined {
    return this.data[address] && this.data[address][methodId]
  }

  add(address: string, abi: ABIElement[]) {
    const abiByMethodIds: Record<string, ABIElement> = {}
    for (const abiElement of abi) {
      const methodId = getMethodId(abiElement)
      abiByMethodIds[methodId] = abiElement
    }
    this.data[address] = abiByMethodIds
  }
}

export function getMethodId(abiElement: ABIElement): string {
  const signature = `${abiElement.name}(${abiElement.inputs.map((i) => i.type).join(',')})`
  return '0x' + keccak256(signature).toString('hex').slice(0, 8)
}
