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

    // Find balanced parentheses chunks and add 'tuple' prefix if they're array types
    let depth = 0
    let currentParam = ''
    const params: string[] = []

    for (let i = 0; i < signatureParams.length; i++) {
      const char = signatureParams[i]

      if (char === '(') depth++
      if (char === ')') depth--

      if (depth === 0 && char === ',') {
        params.push(currentParam.trim())
        currentParam = ''
      } else {
        currentParam += char
        // Check if it's end of string or next char is array marker
        if (i === signatureParams.length - 1 || (signatureParams[i + 1] === '[' && depth === 0)) {
          // Capture the array marker if present
          if (signatureParams[i + 1] === '[') {
            currentParam += '[]'
            i += 2 // Skip the [] characters
          }
          if (currentParam.startsWith('(')) {
            currentParam = 'tuple' + currentParam
          }
        }
      }
    }

    // Push the last param
    params.push(currentParam.trim())

    return params
  }

  encodeMethodParams(decodedParams: any[]): string {
    return defaultAbiCoder.encode(this.params, decodedParams)
  }

  decodeMethodParams(encodedParams: string): any {
    return defaultAbiCoder.decode(this.params, encodedParams)
  }
}
