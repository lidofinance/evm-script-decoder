export type Network = 'mainnet' | 'ropsten' | 'rinkeby' | 'kovan' | 'goerli'
export type Address = string
export type EVMScriptEncoded = string
export type ABIElement = {
  anonymous?: boolean
  type: string
  name: string
  inputs?: ABIElementInputOutput[]
  outputs?: ABIElementInputOutput[]
  stateMutability?: string
  payable?: boolean
  constant?: boolean
}

interface ABIElementInputOutput {
  name: string
  type: string
  internalType?: string
  indexed?: boolean
  components?: { name: string; type: string }[]
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

export interface ABIProvider {
  getABI(contract: Address): Promise<ABIElement[]>
}

export interface Fetcher {
  (address: string): Promise<{ status: number; json(): Promise<any> }>
}

declare global {
  var fetch: Fetcher
}
