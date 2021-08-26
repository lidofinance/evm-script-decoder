import { EVMScriptParser } from './EVMScriptParser'
import {
  ABIProvider,
  Address,
  EVMScriptCallToEncode,
  EVMScriptDecoded,
  EVMScriptEncoded,
  EVMScriptToEncode,
  MethodInfo,
} from './types'
import { MethodABIProvider } from './MethodABIProvider'
import { FullMethodInfo } from './FullMethodInfo'

const DEFAULT_SPEC_ID = '0x00000001'

export class EVMScriptDecoder {
  private readonly methodABIProvider: MethodABIProvider

  constructor(...providers: ABIProvider[]) {
    this.methodABIProvider = new MethodABIProvider(providers)
  }

  async decodeEVMScript(evmScript: EVMScriptEncoded): Promise<EVMScriptDecoded> {
    const parsedScript: EVMScriptDecoded = EVMScriptParser.parse(evmScript)
    for (const call of parsedScript.calls) {
      const methodInfo = await this.findMethodInfo(call.address, {
        methodId: call.methodId,
      })
      call.abi = methodInfo?.abi
      call.decodedCallData = await methodInfo?.decodeMethodParams(call.encodedCallData)
    }
    return parsedScript
  }

  public async encodeEVMScript(evmScript: EVMScriptToEncode) {
    let evmScriptEncoded = evmScript.specId || DEFAULT_SPEC_ID
    for (const evmScriptCallInput of evmScript.calls) {
      evmScriptEncoded += await this.encodeEVMScriptCall(evmScriptCallInput, evmScript.address)
    }
    return evmScriptEncoded
  }

  private async encodeEVMScriptCall(
    evmScriptCall: EVMScriptCallToEncode,
    defaultAddress?: Address
  ) {
    let { address = defaultAddress, encodedCallData, methodId } = evmScriptCall
    let methodInfo: FullMethodInfo | undefined
    if (encodedCallData === undefined) {
      methodInfo = await this.getMethodInfo(address, evmScriptCall)
      encodedCallData = methodInfo.encodeMethodParams(evmScriptCall.decodedCallData)
    }
    if (!methodId) {
      methodInfo = methodInfo ?? (await this.getMethodInfo(address, evmScriptCall))
      methodId = methodInfo.methodId
    }
    const callDataLength = Number(encodedCallData.length / 2 - 1 + 4)
      .toString(16)
      .padStart(8, '0')
    return address.slice(2) + callDataLength + methodId.slice(2) + encodedCallData.slice(2)
  }

  private async getMethodInfo(address: Address, methodInfo: MethodInfo) {
    const res = await this.findMethodInfo(address, methodInfo)
    if (!res) {
      throw new Error(
        `Method ABI for method "${methodInfo.methodId || methodInfo.methodName}" not found`
      )
    }
    return res
  }

  private async findMethodInfo(address: Address, methodInfo: MethodInfo) {
    if (methodInfo.signature) {
      return FullMethodInfo.fromSignature(address, methodInfo.signature)
    }
    const methodABI = await this.methodABIProvider.retrieveMethodABI(address, methodInfo)
    if (methodABI) {
      return FullMethodInfo.fromABI(address, methodABI)
    }
  }
}
