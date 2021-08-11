import { EVMScriptDecoder, providers } from '../src/index'
import { CONTRACT_ABI, LOCAL_EVM_SCRIPT_EXAMPLE, REMOTE_EVM_SCRIPT_EXAMPLE } from './constants'

async function main() {
  const decoder = new EVMScriptDecoder([
    new providers.Local({
      '0x7899EF901Ed9B331bAf7759c15D2e8728e8c2a2C': CONTRACT_ABI,
    }),
  ])

  const unknownAddressDecodedEVMScript = await decoder.decodeEVMScript(REMOTE_EVM_SCRIPT_EXAMPLE)
  console.log(
    'Example of EVMScript decode via local ABI files ' +
      'when EVMScript contains address not provided in ABIs:'
  )
  console.dir(unknownAddressDecodedEVMScript, { depth: 5 })
  const knownAddressDecodedEVMScript = await decoder.decodeEVMScript(LOCAL_EVM_SCRIPT_EXAMPLE)

  console.log(
    'Example of EVMScript decode result via local ABI files ' +
      'when EVMScript contains address listed in ABIs:'
  )
  console.dir(knownAddressDecodedEVMScript, { depth: 5 })

  console.log('EVM Script calls next methods:')
  for (const call of knownAddressDecodedEVMScript.calls) {
    if (call.abi) {
      console.log(
        `${call.abi.name}(${call.decodedCallData?.join(', ')}) on address ${call.address}`
      )
    }
  }
}

main()
