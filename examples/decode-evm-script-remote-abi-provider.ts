import fetch from 'node-fetch'
import { EVMScriptDecoder, providers } from '../src/index'
import {
  ETHERSCAN_API_KEY,
  createEVMScriptExample,
  NOT_CONTRACT_ADDRESS,
  NOT_VERIFIED_CONTRACT,
  VERIFIED_CONTRACT,
} from './constants'

async function main() {
  const decoder = new EVMScriptDecoder([
    new providers.Etherscan({
      network: 'rinkeby',
      apiKey: ETHERSCAN_API_KEY,
      fetch,
    }),
  ])

  const notContractDecodedEVMScript = await decoder.decodeEVMScript(
    createEVMScriptExample(NOT_CONTRACT_ADDRESS)
  )
  console.log(
    'Example of EVMScript decode via Etherscan API ' +
      'when EVMScript contains address which not a contract:'
  )
  console.dir(notContractDecodedEVMScript, { depth: 5 })

  const notVerifiedContractDecodedEVMScript = await decoder.decodeEVMScript(
    createEVMScriptExample(NOT_VERIFIED_CONTRACT)
  )
  console.log(
    'Example of EVMScript decode via Etherscan API ' +
      'when EVMScript contains address of contract which code is not verified:'
  )
  console.dir(notVerifiedContractDecodedEVMScript, { depth: 5 })

  const knownAddressDecodedEVMScript = await decoder.decodeEVMScript(
    createEVMScriptExample(VERIFIED_CONTRACT)
  )
  console.log(
    'Example of EVMScript decode result via Etherscan API ' +
      'when EVMScript contains a contract address with provided ABI:'
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
