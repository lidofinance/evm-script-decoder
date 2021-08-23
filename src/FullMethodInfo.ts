import { defaultAbiCoder } from '@ethersproject/abi'
import keccak256 from 'keccak256'
import { ABIElement, Address } from './types'

export class FullMethodInfo {
  public signature: string
  public address: Address
  public params: string[]
  public methodId: string
  public abi?: ABIElement

  static fromABI(address: Address, abi: ABIElement): FullMethodInfo {
    const signature = `${abi.name}(${abi.inputs.map((i) => i.type).join(',')})`
    return new FullMethodInfo(address, signature, abi)
  }
  static fromSignature(address: Address, signature: string): FullMethodInfo {
    return new FullMethodInfo(address, signature)
  }

  constructor(address: Address, signature: string, abi?: ABIElement) {
    this.address = address
    this.signature = signature
    const signatureParamsRegex = /\(([a-zA-Z0-9,()]*)\)/i
    const [, signatureParams] = signature.match(signatureParamsRegex)
    this.params = signatureParams.split(',')
    this.methodId = '0x' + keccak256(signature).toString('hex').slice(0, 8)
    this.abi = abi
  }

  encodeMethodParams(decodedParams: any[]): string {
    return defaultAbiCoder.encode(this.params, decodedParams)
  }

  decodeMethodParams(encodedParams: string): any {
    return defaultAbiCoder
      .decode(this.params, encodedParams)
      .map((param) => (param?._isBigNumber ? param.toString() : param))
  }
}
