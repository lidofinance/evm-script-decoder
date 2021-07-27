import nodeFetch from 'node-fetch'

export type Address = string
export type EVMScriptEncoded = string
export type ABIElement = {
  constant: boolean
  inputs: any[] // TODO: use better types
  name: string
  outputs: any[] // TODO: use better types
  payable: boolean
  stateMutability: 'view' | 'nonpayable'
  type: 'function' | 'event'
}

export interface EVMScriptDecoded {
  specId: string
  calls: EVMScriptCall[]
}

export interface EVMScriptParsed {
  address: string
  methodId: string
  callDataLength: number
  encodedCallData: string
}

export interface EVMScriptCall extends EVMScriptParsed {
  decodedCallData?: any[]
  abi?: ABIElement
}

export interface ABIProviderStrategy {
  getABI(contract: Address): Promise<ABIElement[]>
}

declare global {
  var fetch: typeof nodeFetch
}
