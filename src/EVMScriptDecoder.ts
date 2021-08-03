import keccak256 from 'keccak256'
import { ABICache, getMethodId } from './ABICache'
import { ABIProvider } from './ABIProvider'
import { Interface } from '@ethersproject/abi'
import { EVMScriptParser } from './EVMScriptParser'
import { ABIProviderStrategyLocal } from './ABIProviderStrategyLocal'
import { ABIProviderStrategyEtherscan } from './ABIProviderStrategyEtherscan'
import { ABIElement, Address, EVMScriptCall, EVMScriptDecoded, EVMScriptEncoded } from './types'

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

function isEVMScriptCallInputSignature(
  evmScriptCallInput: EVMScriptCallInput
): evmScriptCallInput is EVMScriptCallInputSignature {
  return !!(evmScriptCallInput as EVMScriptCallInputSignature).signature
}

function isEVMScriptCallInputMethod(
  evmScriptCallInput: EVMScriptCallInput
): evmScriptCallInput is EVMScriptCallInputMethod {
  return !!(evmScriptCallInput as EVMScriptCallInputMethod).method
}

export class EVMScriptDecoder {
  private readonly abiProvider: ABIProvider
  private readonly cache: ABICache

  constructor({ etherscanApiKey, abi }: EVMScriptDecoderConfig = {}) {
    this.abiProvider = new ABIProvider()
    if (abi) {
      this.abiProvider.addStrategy(new ABIProviderStrategyLocal(abi))
    }
    if (etherscanApiKey) {
      this.abiProvider.addStrategy(new ABIProviderStrategyEtherscan(etherscanApiKey))
    }
    this.cache = new ABICache()
  }

  async encodeEVMScript(calls: EVMScriptCallInput[], specId = DEFAULT_SPEC_ID) {
    let evmScript = specId
    for (const evmScriptCallInput of calls) {
      const { address, params } = evmScriptCallInput
      const contractABI = await this.retrieveContractABI(address)
      if (!contractABI) {
        throw new Error(`ABI for contract ${address} not found`)
      }
      let methodABI: ABIElement | undefined = undefined
      if (isEVMScriptCallInputSignature(evmScriptCallInput)) {
        const { signature } = evmScriptCallInput
        methodABI = findBySignature(contractABI, signature)
        if (!methodABI) {
          throw new Error(
            `ABI for method with signature ${signature} not found in contract ${address}`
          )
        }
      } else if (isEVMScriptCallInputMethod(evmScriptCallInput)) {
        const { method } = evmScriptCallInput
        methodABI = contractABI.find((abi) => abi.name === evmScriptCallInput.method)
        if (!methodABI) {
          throw new Error(`ABI for method ${method} not found in contract ${address}`)
        }
      }
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
      call.abi = await this.retrieveMethodABI(call)
      call.decodedCallData = this.decodeFunctionData(call)
    }
    return parsedScript
  }

  private async retrieveContractABI(address: Address) {
    if (this.cache.hasContractABI(address)) {
      return this.cache.getContractABI(address)
    }
    let abi = await this.abiProvider.getABI(address)
    this.cache.add(address, abi || [])
    return this.cache.getContractABI(address)
  }

  private async retrieveMethodABI(data: {
    address: Address
    methodId: string
  }): Promise<ABIElement | undefined> {
    if (this.cache.hasMethodABI(data.address, data.methodId)) {
      return this.cache.getMethodABI(data.address, data.methodId)
    }
    let abi = await this.abiProvider.getABI(data.address)
    this.cache.add(data.address, abi || [])
    return this.cache.getMethodABI(data.address, data.methodId)
  }

  private encodeFunctionData(methodABI: ABIElement, params?: any[]): string {
    const i = new Interface(JSON.stringify([methodABI]))
    return i.encodeFunctionData(methodABI.name, params)
  }

  private decodeFunctionData(data: EVMScriptCall): any[] | undefined {
    const abi = this.cache.getMethodABI(data.address, data.methodId)
    if (!abi) {
      return undefined
    }
    const i = new Interface(JSON.stringify([abi]))
    return Array.from(
      i.decodeFunctionData(abi.name, data.methodId + data.encodedCallData.substring(2))
    )
  }
}

function findBySignature(contractABI: ABIElement[], signature: string): ABIElement | undefined {
  const methodId = '0x' + keccak256(signature).toString('hex').slice(0, 8)
  return contractABI.find((a) => getMethodId(a) === methodId)
}
