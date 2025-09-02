import fetch from 'node-fetch'
import { EVMScriptDecoder, abiProviders } from '../src/index'
import { ETHERSCAN_API_KEY, RPC_URL } from './constants'
import { Contract, providers as ethersProviders } from 'ethers'

const EVM_SCRIPT_EXAMPLE = `0x0000000155032650b14df07b85bF18A3a3eC8E0Af2e028d50000002491dcd6b20000000000000000000000000000000000000000000000000000000000000001`

async function main() {
  const proxyOffDecoder = new EVMScriptDecoder(
    new abiProviders.Etherscan({
      network: 'mainnet',
      apiKey: ETHERSCAN_API_KEY,
      fetch,
    })
  )

  const unproxiedContractDecodedEVMScript = await proxyOffDecoder.decodeEVMScript(
    EVM_SCRIPT_EXAMPLE
  )
  console.log(
    'Example of EVMScript decode via Etherscan API without ProxyABIMiddleware ' +
      'when EVMScript contains address of contract which uses proxy:'
  )
  console.dir(unproxiedContractDecodedEVMScript, { depth: 5 })

  const proxyOnDecoder = new EVMScriptDecoder(
    new abiProviders.Etherscan({
      network: 'mainnet',
      apiKey: ETHERSCAN_API_KEY,
      fetch,
      middlewares: [
        abiProviders.middlewares.ProxyABIMiddleware({
          implMethodNames: [
            ...abiProviders.middlewares.ProxyABIMiddleware.DefaultImplMethodNames,
            '__Proxy_implementation',
          ],
          async loadImplAddress(proxyAddress, abiElement) {
            const contract = new Contract(
              proxyAddress,
              [abiElement],
              new ethersProviders.JsonRpcProvider(RPC_URL)
            )
            return contract[abiElement.name]()
          },
        }),
      ],
    })
  )

  const proxiedContractDecodedEVMScript = await proxyOnDecoder.decodeEVMScript(EVM_SCRIPT_EXAMPLE)
  console.log(
    'Example of EVMScript decode via Etherscan API with ProxyABIMiddleware ' +
      'when EVMScript contains address of contract which uses proxy:'
  )
  console.dir(proxiedContractDecodedEVMScript, { depth: 5 })
}

main()
