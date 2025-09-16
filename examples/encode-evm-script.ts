import fetch from 'node-fetch'
import { defaultAbiCoder } from '@ethersproject/abi'
import { EVMScriptDecoder, abiProviders } from '../src/index'
import {
  VERIFIED_CONTRACT,
  NOT_CONTRACT_ADDRESS,
  ETHERSCAN_API_KEY,
  VERIFIED_NON_PROXY_CONTRACT,
} from './constants'

async function main() {
  const decoder = new EVMScriptDecoder(
    new abiProviders.Etherscan({
      chainId: 1,
      apiKey: ETHERSCAN_API_KEY,
      fetch,
    })
  )
  const encodedEVMScriptByMethodIdAndEncodedCallData = await decoder.encodeEVMScript({
    calls: [
      {
        address: VERIFIED_CONTRACT,
        methodId: '0x91dcd6b2',
        encodedCallData: defaultAbiCoder.encode(['uint256'], [1]),
      },
    ],
  })
  console.log('Example of encoded EVMScript by methodId and encodedCallData:')
  console.log(encodedEVMScriptByMethodIdAndEncodedCallData)

  const encodedEVMScriptBySignatureAndEncodedCallData = await decoder.encodeEVMScript({
    calls: [
      {
        address: VERIFIED_CONTRACT,
        signature: 'activateNodeOperator(uint256)',
        encodedCallData: defaultAbiCoder.encode(['uint256'], [1]),
      },
    ],
  })
  console.log('Example of encoded EVMScript by method signature and encodedCallData:')
  console.log(encodedEVMScriptBySignatureAndEncodedCallData)

  const encodedEVMScriptByMethodNameAndEncodedCallData = await decoder.encodeEVMScript({
    calls: [
      {
        address: VERIFIED_NON_PROXY_CONTRACT,
        methodName: 'setEVMScriptExecutor',
        encodedCallData: defaultAbiCoder.encode(['address'], [NOT_CONTRACT_ADDRESS]),
      },
    ],
  })
  console.log('Example of encoded EVMScript by method name and decodedCallData:')
  console.log(encodedEVMScriptByMethodNameAndEncodedCallData)

  const encodedEVMScriptByMethodNameAndDecodedCallData = await decoder.encodeEVMScript({
    calls: [
      {
        address: VERIFIED_NON_PROXY_CONTRACT,
        methodName: 'setEVMScriptExecutor',
        decodedCallData: [NOT_CONTRACT_ADDRESS],
      },
    ],
  })
  console.log('Example of encoded EVMScript by method name and decodedCallData:')
  console.log(encodedEVMScriptByMethodNameAndDecodedCallData)
}

main()
