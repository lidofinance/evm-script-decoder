import { defaultAbiCoder } from '@ethersproject/abi'
import { ABIElement, Address } from './types'
import { getMethodId, getMethodSignature } from './utils'

export class FullMethodInfo {
  public signature: string
  public address: Address
  public params: string[]
  public methodId: string
  public abi?: ABIElement

  static fromABI(address: Address, abi: ABIElement): FullMethodInfo {
    const signature = getMethodSignature(abi)
    return new FullMethodInfo(address, signature, abi)
  }
  static fromSignature(address: Address, signature: string): FullMethodInfo {
    return new FullMethodInfo(address, signature)
  }

  constructor(address: Address, signature: string, abi?: ABIElement) {
    this.address = address
    this.signature = signature
    this.params = this.parseSignature(signature)
    this.methodId = getMethodId(signature)
    this.abi = abi
  }

  private parseSignature(signature: string): string[] {
    // Extract everything inside the outermost parentheses
    const signatureParamsRegex = /\((.*)\)/
    const [, signatureParams] = signature.match(signatureParamsRegex)

    const params: string[] = []
    let currentParam = ''
    let parentDepth = 0
    let bracketDepth = 0

    for (let i = 0; i < signatureParams.length; i++) {
      const char = signatureParams[i]

      // Track depth of parentheses
      if (char === '(') parentDepth++
      if (char === ')') parentDepth--

      // Track depth of brackets
      if (char === '[') bracketDepth++
      if (char === ']') bracketDepth--

      // Only split parameters at top level commas
      if (char === ',' && parentDepth === 0 && bracketDepth === 0) {
        params.push(currentParam.trim())
        currentParam = ''
        continue
      }

      // Handle tuple type detection
      if (char === '(' && parentDepth === 1 && !currentParam.includes('tuple')) {
        currentParam = 'tuple' + currentParam
      }

      currentParam += char
    }

    // Push the last param if there is one
    if (currentParam.trim()) {
      params.push(currentParam.trim())
    }

    return params
  }

  encodeMethodParams(decodedParams: any[]): string {
    return defaultAbiCoder.encode(this.params, decodedParams)
  }

  decodeMethodParams(encodedParams: string): any {
    return defaultAbiCoder.decode(this.params, encodedParams)
  }
}
