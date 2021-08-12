import { defaultAbiCoder } from '@ethersproject/abi'
import keccak256 from 'keccak256'
import { ABIElement, Address } from './types'

export class SignatureMethodInfo {
  public signature: string
  public address: Address
  public params: string[]
  public methodId: string

  constructor(address: Address, signature: string) {
    this.address = address
    this.signature = signature
    const signatureParamsRegex = /\(([a-zA-Z0-9,()]*)\)/i
    const [, signatureParams] = signature.match(signatureParamsRegex)
    this.params = signatureParams.split(',')
    this.methodId = '0x' + keccak256(signature).toString('hex').slice(0, 8)
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

export class ABIMethodInfo extends SignatureMethodInfo {
  public abi: ABIElement

  constructor(address: Address, abi: ABIElement) {
    super(address, `${abi.name}(${abi.inputs.map((i) => i.type).join(',')})`)
    this.abi = abi
  }
}
