import fetch from 'node-fetch'
import { EVMScriptDecoder, providers } from '../src/index'
import { DefaultImplMethodNames, ProxyABIMiddleware } from '../src/ProxyABIMiddleware'
import { ETHERSCAN_API_KEY } from './constants'
import { Contract, providers as ethersProviders } from 'ethers'

const RPC_PROVIDER = 'https://rinkeby.infura.io/v3/be90129e6aee40f2af06becac2521b7a'
const EVM_SCRIPT_EXAMPLE =
  '0x00000001' +
  '0006DE2639a6FC48349aA0B116F499621168a112' +
  '00000124' +
  '9a4ee59c' +
  '0000000000000000000000000000000000000000000000000000000000000017' +
  '0000000000000000000000000000000000000000000000000000000000000040' +
  '00000000000000000000000000000000000000000000000000000000000000c0' +
  '0000000000000000000000000000000000000000000000000000000000000040' +
  '0000000000000000000000000000000000000000000000000000000000000080' +
  '0000000000000000000000000000000000000000000000000000000000000001' +
  '0000000000000000000000000000000000000000000000000000000000000000' +
  '0000000000000000000000000000000000000000000000000000000000000001' +
  '0000000000000000000000000000000000000000000000000de0b6b3a7640000'

async function main() {
  const proxyOffDecoder = new EVMScriptDecoder([
    new providers.Etherscan({
      network: 'rinkeby',
      apiKey: ETHERSCAN_API_KEY,
      fetch,
    }),
  ])

  const unproxiedContractDecodedEVMScript = await proxyOffDecoder.decodeEVMScript(
    EVM_SCRIPT_EXAMPLE
  )
  console.log(
    'Example of EVMScript decode via Etherscan API without ProxyABIMiddleware ' +
      'when EVMScript contains address of contract which uses proxy:'
  )
  console.dir(unproxiedContractDecodedEVMScript, { depth: 5 })

  const proxyOnDecoder = new EVMScriptDecoder([
    new providers.Etherscan({
      network: 'rinkeby',
      apiKey: ETHERSCAN_API_KEY,
      fetch,
      middlewares: [
        ProxyABIMiddleware({
          implMethodNames: [...DefaultImplMethodNames, '__Proxy_implementation'],
          async loadImplAddress(proxyAddress, abiElement) {
            const contract = new Contract(
              proxyAddress,
              [abiElement],
              new ethersProviders.JsonRpcProvider(RPC_PROVIDER)
            )
            return contract[abiElement.name]()
          },
        }),
      ],
    }),
  ])

  const proxiedContractDecodedEVMScript = await proxyOnDecoder.decodeEVMScript(EVM_SCRIPT_EXAMPLE)
  console.log(
    'Example of EVMScript decode via Etherscan API with ProxyABIMiddleware ' +
      'when EVMScript contains address of contract which uses proxy:'
  )
  console.dir(proxiedContractDecodedEVMScript, { depth: 5 })
}

main()
