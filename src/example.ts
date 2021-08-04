import { EVMScriptDecoder } from '.'

const ETHERSCAN_API_KEY = 'T7E7J4JUY49ZJBGB8QT9I4YHJKUEFTP3ZA'

async function main() {
  const decoder = new EVMScriptDecoder({
    network: 'rinkeby',
    etherscanApiKey: ETHERSCAN_API_KEY,
    abi: {
      '0x7899EF901Ed9B331bAf7759c15D2e8728e8c2a2C': [
        {
          constant: false,
          inputs: [
            { name: '_id', type: 'uint256' },
            { name: '_stakingLimit', type: 'uint64' },
          ],
          name: 'setNodeOperatorStakingLimit',
          outputs: [],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
    },
  })

  const evmScriptEncodedManyCalls = await decoder.encodeEVMScript([
    {
      address: '0x07804b6667d649c819dfa94af50c782c26f5abc3',
      method: 'removeRewardProgram',
      params: ['0x922c10dafffb8b9be4c40d3829c8c708a12827f3'],
    },
  ])
  console.log('Encoded EVMScript from many calls:')
  console.log(evmScriptEncodedManyCalls)

  const evmScriptEncodeOneAddress = await decoder.encodeEVMScript(
    '0x07804b6667d649c819dfa94af50c782c26f5abc3',
    [
      {
        method: '0x945233e2',
        params: ['0x922c10dafffb8b9be4c40d3829c8c708a12827f3'],
      },
    ]
  )
  console.log('Encoded EVMScript one address many calls:')
  console.log(evmScriptEncodeOneAddress)

  const evmScriptEncodeOneCall = await decoder.encodeEVMScript(
    '0x07804b6667d649c819dfa94af50c782c26f5abc3',
    'removeRewardProgram(address)',
    ['0x922c10dafffb8b9be4c40d3829c8c708a12827f3']
  )
  console.log('Encoded EVMScript one address one call:')
  console.log(evmScriptEncodeOneCall)

  const evmScript = await decoder.decodeEVMScript(
    '0x0000000107804b6667d649c819dfa94af50c782c26f5abc300000024945233e2000000000000000000000000922c10dafffb8b9be4c40d3829c8c708a12827f3'
  )

  console.log('Example of EVMScript decode result via etherscan API:')
  console.dir(evmScript, { depth: 9 })

  console.log('Example of EVMScript decode result via local ABI files')
  console.dir(
    await decoder.decodeEVMScript(
      '0x000000017899ef901ed9b331baf7759c15d2e8728e8c2a2c00000044ae962acf000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000c9'
    ),
    { depth: 8 }
  )

  console.log('EVM Script calls next methods:')
  for (const call of evmScript.calls) {
    if (call.abi) {
      console.log(
        `${call.abi.name}(${call.decodedCallData?.join(', ')}) on address ${call.address}`
      )
    }
  }
}

main()
