import { EVMScriptDecoder } from '.'

const ETHERSCAN_API_KEY = 'T7E7J4JUY49ZJBGB8QT9I4YHJKUEFTP3ZA'

async function main() {
  const decoder = new EVMScriptDecoder({ etherscanApiKey: ETHERSCAN_API_KEY })
  const evmScript = await decoder.decodeEVMScript(
    '0x0000000107804b6667d649c819dfa94af50c782c26f5abc300000024945233e2000000000000000000000000922c10dafffb8b9be4c40d3829c8c708a12827f3'
  )

  console.log('Example of EVMScript decode result:')
  console.dir(evmScript, { depth: 9 })

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
