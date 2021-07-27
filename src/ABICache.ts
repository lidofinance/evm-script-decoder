import keccak256 from 'keccak256'
import { ABIElement } from './types'

export class ABICache {
  // stores ABI elements by address by methodid
  private readonly data: Record<string, Record<string, ABIElement>> = {}

  has(address: string, methodId: string): boolean {
    return !!(this.data[address] && this.data[address][methodId])
  }

  get(address: string, methodId: string): ABIElement | undefined {
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

function getMethodId(abiElement: ABIElement): string {
  const signature = `${abiElement.name}(${abiElement.inputs.map((i) => i.type).join(',')})`
  return '0x' + keccak256(signature).toString('hex').slice(0, 8)
}
