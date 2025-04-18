import keccak256 from 'keccak256'
import { ABIElement } from './types'

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

export function getMethodSignature(abiElement: ABIElement): string {
  return `${abiElement.name}(${abiElement.inputs.map(getComplexType).join(',')})`
}

export function getMethodId(signature: string): string {
  return '0x' + keccak256(signature).toString('hex').slice(0, 8)
}
