import { ABICache } from './ABICache'
import { ABIProvider } from './ABIProvider'
import { Interface } from '@ethersproject/abi'
import { EVMScriptParser } from './EVMScriptParser'
import { ABIProviderStrategyLocal } from './ABIProviderStrategyLocal'
import { ABIProviderStrategyEtherscan } from './ABIProviderStrategyEtherscan'
import { ABIElement, Address, EVMScriptCall, EVMScriptDecoded, EVMScriptEncoded } from './types'

interface EVMScriptDecoderConfig {
  etherscanApiKey?: string
  abi?: Record<Address, ABIElement[]>
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

  async decodeEVMScript(evmScript: EVMScriptEncoded): Promise<EVMScriptDecoded> {
    const parsedScript: EVMScriptDecoded = EVMScriptParser.parse(evmScript)
    for (const call of parsedScript.calls) {
      call.abi = await this.retrieveABI(call)
      call.decodedCallData = this.decodeFunctionData(call)
    }
    return parsedScript
  }

  private async retrieveABI(data: {
    address: Address
    methodId: string
  }): Promise<ABIElement | undefined> {
    if (this.cache.has(data.address, data.methodId)) {
      return this.cache.get(data.address, data.methodId)
    }
    let abi = await this.abiProvider.getABI(data.address)
    this.cache.add(data.address, abi || [])
    return this.cache.get(data.address, data.methodId)
  }

  private decodeFunctionData(data: EVMScriptCall): any[] | undefined {
    const abi = this.cache.get(data.address, data.methodId)
    if (!abi) {
      return undefined
    }
    const i = new Interface(JSON.stringify([abi]))
    return Array.from(
      i.decodeFunctionData(abi.name, data.methodId + data.encodedCallData.substring(2))
    )
  }
}
