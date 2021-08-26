# EVMScript Decoder

Library provides functionality to encode/decode [Aragon's EVMScripts](https://hack.aragon.org/docs/aragonos-ref#evmscripts-1).

## Usage

Library provides three primary methods to work with Aragon's EVMScripts:

- [EVMScriptParser.parse()](#evmscriptparserparse)
- [EVMScriptDecoder.decodeEVMScript()](#evmscriptdecoderdecodeevmscript)
- [EVMScriptDecoder.encodeEVMScript()](#evmscriptdecoderencodeevmscript)

### EVMScriptParser.parse()

Parses passed EVMScript without params decoding

```javascript
import { EVMScriptParser } from 'evm-script-decoder'

const evmScript =
  '0x00000001' + // spec id
  '7804b6667d649c819dfa94af50c782c26f5abc3' + // address
  '00000024' + // calldata length
  '945233e2' + // method id
  '000000000000000000000000922c10dafffb8b9be4c40d3829c8c708a12827f3' // calldata

const parsedEVMScript = EVMScriptParser.parse(evmScript)
console.log(parsedEVMScript)
```

Above `console.log` will display next output:

```javascript
{
    specId: '0x00000001',
    calls: [{
        address: '0x7804b6667d649c819dfa94af50c782c26f5abc3',
        callDataLength: 36,
        methodId: '0x945233e2',
        encodedCallData: '0x000000000000000000000000922c10dafffb8b9be4c40d3829c8c708a12827f3'
    }]
}
```

### EVMScriptDecoder.decodeEVMScript()

In addition to parsing, EVMScriptDecoder tries to decode calldata and find ABI for every method call contained in EVMScript.

To get ABI of method, EVMScriptDecoder uses ABIProviders. Out of the box included three types of ABIProviders:

- `Base` - provides interface to implement own ABI provider
- `Local` - search method ABIs in passed dictionary
- `Etherscan` - uses Etherscan API to retrieve ABIs

Example of usage of `EVMScriptDecoder` with Etherscan provider:

```javascript
import { EVMScriptDecoder, providers } from 'evm-script-decoder'

const ETHERSCAN_API_KEY = '...'

// Note: Etherscan provider expects that fetch declared in
// globalThis scope, what is true for browsers but not for node.js.
// To use Etherscan provider in node.js you can use polyfill for fetch
// (node-fetch for example) and add it to globalThis object, or pass
// it directly in constructor as parameter of config.
const etherscanEVMScriptDecoder = new EVMScriptDecoder(
  new providers.Etherscan({
    network: 'mainnet',
    apiKey: ETHERSCAN_API_KEY,
  })
)

const decodedEVMScript = await etherscanEVMScriptDecoder.decode(evmScript)
console.log(decodedEVMScript)
```

If ABI for methods used in EVMScript were successfully found on Etherscan, `console.log` will display the next output:

```javascript
{
    specId: '0x00000001',
    calls: [{
        address: '0x7804b6667d649c819dfa94af50c782c26f5abc3',
        callDataLength: 36,
        methodId: '0x945233e2',
        encodedCallData: '0x000000000000000000000000922c10dafffb8b9be4c40d3829c8c708a12827f3',
        abi: {
            inputs: [
            {
                internalType: 'address',
                name: '_rewardProgram',
                type: 'address'
            }
            ],
            name: 'removeRewardProgram',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function'
      },
      decodedCallData: [ '0x922C10dAfffb8B9bE4C40d3829C8c708a12827F3' ]
    }]
}
```

If ABIs wasn't found or some error happened on request to Etherscan, `EVMScriptDecoder` will return same result as `EVMScriptParser`.

Example of usage of EVMScriptDecoder with `Local` ABI provider:

```javascript
import { EVMScriptDecoder, providers } from 'evm-script-decoder'

const localEVMScriptDecoder = new EVMScriptDecoder(
  new providers.Local({
    '0x7804b6667d649c819dfa94af50c782c26f5abc3': [
      {
        inputs: [
          {
            internalType: 'address',
            name: '_rewardProgram',
            type: 'address',
          },
        ],
        name: 'removeRewardProgram',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
  })
)

const decodedEVMScript = await etherscanEVMScriptDecoder.decode(evmScript)
console.log(decodedEVMScript)
```

If ABI for methods used in EVMScript were passed to `Local` ABI Provider, `console.log` will display the same output as for `Etherscan` provider.

Also `EVMScriptDecoder` might be used with multiple ABI providers:

```javascript
const evmScriptDecoder = new EVMScriptDecoder(
  new providers.Local({
    '0x7899EF901Ed9B331bAf7759c15D2e8728e8c2a2C': [],
  }),
  new providers.Etherscan({ network: 'mainnet', apiKey: ETHERSCAN_API_KEY })
)
```

In this case, EVMScriptDecoder will use passed providers one by one to retrieve ABIs, until one of them return the result.

You can find more examples of usage of scripts decoding in `/examples` folder.

### EVMScriptDecoder.encodeEVMScript()

Might be used for the convenient creation of EVMScripts.

```javascript
import { defaultAbiCoder } from '@ethersproject/abi'
import { EVMScriptDecoder, providers } from 'evm-script-decoder'

const evmScriptDecoder = new EVMScriptDecoder
  new providers.Local({
    '0x7899EF901Ed9B331bAf7759c15D2e8728e8c2a2C': [],
  }),
  new providers.Etherscan({ network: 'mainnet', apiKey: ETHERSCAN_API_KEY }),
)

const evmScriptManyCalls = await decoder.encodeEVMScript({
  // optional default address, which will be used if
  // an object in calls array has no address property
  address: '0x07804b6667d649c819dfa94af50c782c26f5abc3',
  calls: [
    {
      address: '0x07804b6667d649c819dfa94af50c782c26f5abc3',
      // when methodName is used, EVMScriptDecoder will use passed ABI provider // to retrieve ABI for provided address and methodName, which will be
      // used to calculate method Id for EVMScript. If ABI for given methodName
      // will not be found, throws an Error
      methodName: 'removeRewardProgram',
      // when decodedCallData property used, EVMScriptDecoder requires
      // ABI for methodId used in current call object. If ABI for given methodName
      // will not be found, throws an Error
      decodedCallData: ['0x922c10dafffb8b9be4c40d3829c8c708a12827f3'],
    },
    {
      // when methodId is provided EVMScriptDecoder will use it directly in
      // EVMScript and will not call ABIProvider
      methodId: '0x945233e2',
      decodedCallData: ['0x922c10dafffb8b9be4c40d3829c8c708a12827f3'],
    },
    {
      // when signature used in call object EVMScriptDecoder will calculate
      // methodId using it and will not call ABIProvider
      signature: 'removeRewardProgram(address)',
      // when encodedCallData used EVMScriptDecoder will use it directly in
      // EVMScript and will not call ABIProvider
      encodedCallData: defaultAbiCoder.encode(
        ['address'],
        ['0x922c10dafffb8b9be4c40d3829c8c708a12827f3']
      ),
    },
    // when you want to use EVMScriptDecoder without providers at all,
    // you should use only methodId or signature and encodedCallData properties
    // in calls objects. Next two calls might be used without ABIProviders:
    {
      methodId: '0x945233e2',
      encodedCallData: defaultAbiCoder.encode(
        ['address'],
        ['0x922c10dafffb8b9be4c40d3829c8c708a12827f3']
      ),
    },
    {
      signature: 'removeRewardProgram(address)',
      encodedCallData: defaultAbiCoder.encode(
        ['address'],
        ['0x922c10dafffb8b9be4c40d3829c8c708a12827f3']
      ),
    },
  ],
})
```

### Usage with proxy contracts

Some contracts use Proxy pattern to support upgradability of contracts, that might be a problem when you want to decode EVMScript which uses such contracts via Etherscan ABI Provider. Etherscan will not return implementation for such contracts, only ABI of a Proxy contract. To solve this problem, middlewares might be used in ABIProvider:

```javascript
import { EVMScriptDecoder, abiProviders } from 'evm-script-decoder'

const proxyOnDecoder = new EVMScriptDecoder(
  new abiProviders.Etherscan({
    network: 'rinkeby',
    apiKey: ETHERSCAN_API_KEY,
    fetch,
    middlewares: [
      // ProxyABIMiddleware might be used to find the address of
      // implementation contract when fetched ABI is a Proxy contract
      abiProviders.middlewares.ProxyABIMiddleware({
        // ProxyABIMiddleware will compare the name of each method in
        // fetched ABI to check is it a Proxy or not. If one of the method names
        // listed in implMethodNames contains in ABI, loadImplAddress method
        // will be called to retrieve the address of implementation
        implMethodNames: [
          ...abiProviders.middlewares.ProxyABIMiddleware.DefaultImplMethodNames,
          '__Proxy_implementation',
        ],
        // This method must return the address of implementation for the
        // Proxy contract In this example ethers.js library is used to call
        // '__Proxy_implementation' on contract and returns result of this
        // function ProxyABIMiddleware will use ABIProvider to load ABI for
        // address returned by this method and returns it instead of Proxy ABI
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
  })
)
```

Additionally to ProxyABIMiddleware, you can create your own middlewares. Each middleware must implement `ABIProviderMiddleware` interface:

```typescript
interface ABIProviderMiddlewareContext {
  // an instance of ABIProvider where middleware was called
  abiProvider: ABIProvider
  // address of contract, for which ABI was loaded
  address: string
  // ABI retrieved by ABIProvider
  abi: ABIElement[]
}

interface ABIProviderMiddleware {
  (ctx: ABIProviderMiddlewareContext): Promise<ABIElement[]>
}
```
