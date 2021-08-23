import fetch from 'node-fetch'
import { defaultAbiCoder } from '@ethersproject/abi'
import { EVMScriptDecoder, providers } from '../src/index'
import { VERIFIED_CONTRACT, NOT_CONTRACT_ADDRESS, ETHERSCAN_API_KEY } from './constants'

async function main() {
  const decoder = new EVMScriptDecoder([
    new providers.Etherscan({
      network: 'rinkeby',
      apiKey: ETHERSCAN_API_KEY,
      fetch,
    }),
  ])
  const encodedEVMScriptByMethodIdAndEncodedCallData = await decoder.encodeEVMScript({
    calls: [
      {
        address: VERIFIED_CONTRACT,
        methodId: '0xaaffbbcc',
        encodedCallData: defaultAbiCoder.encode(['uint256', 'uint256'], [1, 2]),
      },
    ],
  })
  console.log('Example of encoded EVMScript by methodId and encodedCallData:')
  console.log(encodedEVMScriptByMethodIdAndEncodedCallData)

  const encodedEVMScriptBySignatureAndEncodedCallData = await decoder.encodeEVMScript({
    calls: [
      {
        address: VERIFIED_CONTRACT,
        signature: 'balanceOf(address)',
        encodedCallData: defaultAbiCoder.encode(['address'], [NOT_CONTRACT_ADDRESS]),
      },
    ],
  })
  console.log('Example of encoded EVMScript by method signature and encodedCallData:')
  console.log(encodedEVMScriptBySignatureAndEncodedCallData)

  const encodedEVMScriptByMethodNameAndEncodedCallData = await decoder.encodeEVMScript({
    calls: [
      {
        address: VERIFIED_CONTRACT,
        methodName: 'addRewardProgram',
        encodedCallData: defaultAbiCoder.encode(['address'], [NOT_CONTRACT_ADDRESS]),
      },
    ],
  })
  console.log('Example of encoded EVMScript by method name and decodedCallData:')
  console.log(encodedEVMScriptByMethodNameAndEncodedCallData)

  const encodedEVMScriptByMethodNameAndDecodedCallData = await decoder.encodeEVMScript({
    calls: [
      {
        address: VERIFIED_CONTRACT,
        methodName: 'addRewardProgram',
        decodedCallData: [NOT_CONTRACT_ADDRESS],
      },
    ],
  })
  console.log('Example of encoded EVMScript by method name and decodedCallData:')
  console.log(encodedEVMScriptByMethodNameAndDecodedCallData)
}

main()
