import keccak256 from 'keccak256'
import { ABIElement, Address } from './types'

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
      const methodId = getMethodId(abiElement)
      abiByMethodIds[methodId] = abiElement
    }
    this.data[address] = abiByMethodIds
  }
}

function getComplexType(input: ABIElement['inputs'][number]): string {
  const isArray = input.type.includes('[')
  if (!isArray) {
    if (input.type === 'tuple' && input.components) {
      return `(${input.components.map(getComplexType).join(',')})`
    }
    return input.type
  }

  const match = input.type.match(/^([a-zA-Z0-9_]+)(\[.*\])$/)
  const [, baseType, arrayDimensions] = match

  if (baseType === 'tuple' && input.components) {
    return `(${input.components.map(getComplexType).join(',')})${arrayDimensions}`
  }

  return input.type
}

export function getMethodId(abiElement: ABIElement): string {
  const inputTypes = abiElement.inputs.map(getComplexType).join(',')
  const signature = `${abiElement.name}(${inputTypes})`

  return '0x' + keccak256(signature).toString('hex').slice(0, 8)
}
