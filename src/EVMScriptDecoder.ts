import { Interface } from '@ethersproject/abi'
import { EVMScriptParser } from './EVMScriptParser'
import { ABIElement, Address, EVMScriptCall, EVMScriptDecoded, EVMScriptEncoded } from './types'
import { MethodABIProvider } from './MethodABIProvider'

const DEFAULT_SPEC_ID = '0x00000001'

interface EVMScriptDecoderConfig {
  etherscanApiKey?: string
  abi?: Record<Address, ABIElement[]>
}

interface EVMScriptCallInputCommon {
  address: string
  params?: any[]
}

interface EVMScriptCallInputSignature extends EVMScriptCallInputCommon {
  signature: string
}

interface EVMScriptCallInputMethod extends EVMScriptCallInputCommon {
  method: string
}

type EVMScriptCallInput = EVMScriptCallInputSignature | EVMScriptCallInputMethod

export class EVMScriptDecoder {
  private readonly methodABIProvider: MethodABIProvider

  constructor({ etherscanApiKey, abi }: EVMScriptDecoderConfig = {}) {
    this.methodABIProvider = new MethodABIProvider({ etherscanApiKey, abi })
  }

  async encodeEVMScript(calls: EVMScriptCallInput[], specId = DEFAULT_SPEC_ID) {
    let evmScript = specId
    for (const evmScriptCallInput of calls) {
      const { address, params } = evmScriptCallInput
      const methodABI = await this.methodABIProvider.retrieveMethodABI(address, evmScriptCallInput)
      const encodedCallData = this.encodeFunctionData(methodABI, params).slice(2)
      const callDataLength = Number(encodedCallData.length / 2)
        .toString(16)
        .padStart(8, '0')
      evmScript += address.slice(2) + callDataLength + encodedCallData
    }
    return evmScript
  }

  async decodeEVMScript(evmScript: EVMScriptEncoded): Promise<EVMScriptDecoded> {
    const parsedScript: EVMScriptDecoded = EVMScriptParser.parse(evmScript)
    for (const call of parsedScript.calls) {
      call.abi = await this.methodABIProvider.retrieveMethodABI(call.address, {
        methodId: call.methodId,
      })
      call.decodedCallData = await this.decodeFunctionData(call)
    }
    return parsedScript
  }

  private encodeFunctionData(methodABI: ABIElement, params?: any[]): string {
    const i = new Interface(JSON.stringify([methodABI]))
    return i.encodeFunctionData(methodABI.name, params)
  }

  private async decodeFunctionData(data: EVMScriptCall): Promise<any[] | undefined> {
    const abi = await this.methodABIProvider.retrieveMethodABI(data.address, {
      methodId: data.methodId,
    })
    if (!abi) {
      return undefined
    }
    const i = new Interface(JSON.stringify([abi]))
    return Array.from(
      i.decodeFunctionData(abi.name, data.methodId + data.encodedCallData.substring(2))
    )
  }
}
