import { Interface } from '@ethersproject/abi'
import { EVMScriptParser } from './EVMScriptParser'
import { ABIElement, EVMScriptCall, EVMScriptDecoded, EVMScriptEncoded } from './types'
import { MethodABIProvider, MethodABIProviderConfig } from './MethodABIProvider'

const DEFAULT_SPEC_ID = '0x00000001'

interface EVMScriptCallInput {
  address: string
  params?: any[]
  method: string
}

export class EVMScriptDecoder {
  private readonly methodABIProvider: MethodABIProvider

  constructor(config: MethodABIProviderConfig = {}) {
    this.methodABIProvider = new MethodABIProvider(config)
  }

  async decodeEVMScript(evmScript: EVMScriptEncoded): Promise<EVMScriptDecoded> {
    const parsedScript: EVMScriptDecoded = EVMScriptParser.parse(evmScript)
    for (const call of parsedScript.calls) {
      call.abi = await this.methodABIProvider.retrieveMethodABI({
        address: call.address,
        method: call.methodId,
      })
      call.decodedCallData = await this.decodeFunctionData(call)
    }
    return parsedScript
  }

  async encodeEVMScript(
    address: string,
    method: string,
    params: any[],
    specId?: string
  ): Promise<EVMScriptEncoded>
  async encodeEVMScript(
    address: string,
    calls: { method: string; params: any[] }[],
    specId?: string
  ): Promise<EVMScriptEncoded>
  async encodeEVMScript(calls: EVMScriptCallInput[], specId?: string): Promise<EVMScriptEncoded>
  async encodeEVMScript(...args: any[]): Promise<EVMScriptEncoded> {
    if (Array.isArray(args[0])) {
      return this.encodeEVMScriptDifferentCalls(args[0], args[1])
    }
    if (Array.isArray(args[1])) {
      return this.encodeEVMScriptOneAddressManyCalls(args[0], args[1], args[2])
    }
    return this.encodeEVMScriptOneCall(args[0], args[1], args[2], args[3])
  }

  private async encodeEVMScriptOneCall(
    address: string,
    method: string,
    params: any[],
    specId = DEFAULT_SPEC_ID
  ): Promise<EVMScriptEncoded> {
    return this.encodeEVMScriptDifferentCalls([{ address, method, params }], specId)
  }

  private async encodeEVMScriptOneAddressManyCalls(
    address: string,
    calls: { method: string; params: any[] }[],
    specId = DEFAULT_SPEC_ID
  ): Promise<EVMScriptEncoded> {
    return this.encodeEVMScriptDifferentCalls(
      calls.map((c) => ({ ...c, address })),
      specId
    )
  }

  private async encodeEVMScriptDifferentCalls(
    calls: EVMScriptCallInput[],
    specId = DEFAULT_SPEC_ID
  ) {
    let evmScript = specId
    for (const evmScriptCallInput of calls) {
      const { address, params } = evmScriptCallInput
      const methodABI = await this.methodABIProvider.retrieveMethodABI(evmScriptCallInput)
      if (!methodABI) {
        throw new Error(
          `ABI for method ${evmScriptCallInput.method} not found on address ${address}`
        )
      }
      const encodedCallData = this.encodeFunctionData(methodABI, params).slice(2)
      const callDataLength = Number(encodedCallData.length / 2)
        .toString(16)
        .padStart(8, '0')
      evmScript += address.slice(2) + callDataLength + encodedCallData
    }
    return evmScript
  }

  private encodeFunctionData(methodABI: ABIElement, params?: any[]): string {
    const i = new Interface(JSON.stringify([methodABI]))
    return i.encodeFunctionData(methodABI.name, params)
  }

  private async decodeFunctionData(data: EVMScriptCall): Promise<any[] | undefined> {
    const abi = await this.methodABIProvider.retrieveMethodABI({
      address: data.address,
      method: data.methodId,
    })
    if (!abi) {
      return undefined
    }
    const i = new Interface(JSON.stringify([abi]))
    return Array.from(
      i.decodeFunctionData(abi.name, data.methodId + data.encodedCallData.substring(2))
    ).map((param) => (param?._isBigNumber ? param.toString() : param))
  }
}
