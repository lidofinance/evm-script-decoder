# EVMScript Decoder

Repository provides functionality to encode/decode Aragon's EVMScripts.

## Usage

Library provides two main classes to work with Aragon's EVMScripts:

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

Additionally to parsing, EVMScriptDecoder tries to decode callData and find abi for every method called in EVMScript.

To get ABI of method, EVMScriptDecoder uses ABIProviders. Out of the box included two types of ABIProviders:

- `Etherscan` - uses Etherscan API to retrieve ABIs
- `Local` - search method ABIs in passed dictionary

Example of usage of `EVMScriptDecoder` with Etherscan provider:

```javascript
import { EVMScriptDecoder, providers } from 'evm-script-decoder'

const ETHERSCAN_API_KEY = 'T7E7J4JUY49ZJBGB8QT9I4YHJKUEFTP3ZA'

// Note: Etherscan provider expects that fetch declared in
// globalThis scope, what is true in browser but not in node.js
// To use Etherscan provider in node.js you can use pollyfill for fetch
// (node-fetch for example) and add it to globalThis object, or pass
// as last param to Etherscan constructor.
const etherscanEVMScriptDecoder = new EVMScriptDecoder([
  new providers.Etherscan('mainnet', ETHERSCAN_API_KEY),
])

const decodedEVMScript = await etherscanEVMScriptDecoder.decode(evmScript)
console.log(decodedEVMScript)
```

If ABIs for methods were successfully found on Etherscan, `console.log` will display next output:

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
import { EVMScriptDecoder, providers } from './index'

const localEVMScriptDecoder = new EVMScriptDecoder([
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
  }),
])

const decodedEVMScript = await etherscanEVMScriptDecoder.decode(evmScript)
console.log(decodedEVMScript)
```

If ABIs for methods contained in map passed to `Local` ABI Provider constructor, `console.log` will display same output as for `Etherscan` provider.

`EVMScriptDecoder` might be used with multiple ABI providers:

```javascript
const evmScriptDecoder = new EVMScriptDecoder([
  new providers.Local({
    '0x7899EF901Ed9B331bAf7759c15D2e8728e8c2a2C': [],
  }),
  new providers.Etherscan('rinkeby', ETHERSCAN_API_KEY),
])
```

In this case EVMScriptDecoder will use passed providers one by one to retrieve ABIs, while some of them will not return the result.

### EVMScriptDecoder.encodeEVMScript()

Might be used for convenient creation of EVMScripts. This method has next overloads:

```javascript
import { EVMScriptDecoder, providers } from './index'
const evmScriptDecoder = new EVMScriptDecoder([
  new providers.Local({
    '0x7899EF901Ed9B331bAf7759c15D2e8728e8c2a2C': [],
  }),
  new providers.Etherscan('rinkeby', ETHERSCAN_API_KEY),
])

// encodeEVMScript might be called with list of calls, EVMScript has to contain
// for 'method' property might be used method name, or method id or method signature
const evmScriptManyCalls = await decoder.encodeEVMScript([
  {
    address: '0x07804b6667d649c819dfa94af50c782c26f5abc3',
    method: 'removeRewardProgram',
    params: ['0x922c10dafffb8b9be4c40d3829c8c708a12827f3'],
  },
])

// If your EVMScript must contain many calls to same address, it might
// be convenient to use next overload. Notice also, that in this case for
// method was used methodId.
const evmScriptOneAddressManyCalls = await decoder.encodeEVMScript(
  '0x07804b6667d649c819dfa94af50c782c26f5abc3',
  [
    {
      method: '0x945233e2',
      params: ['0x922c10dafffb8b9be4c40d3829c8c708a12827f3'],
    },
  ]
)

// When you only have to call one method in EVMScript, next overload
// will be helpful. We used method signature as method value in this case.
// It might be helpful when your contract contains overloaded methods
const evmScriptOneCall = await decoder.encodeEVMScript(
  '0x07804b6667d649c819dfa94af50c782c26f5abc3',
  'removeRewardProgram(address)',
  ['0x922c10dafffb8b9be4c40d3829c8c708a12827f3']
)
```

The results of all above method calls are the same.
Notice, that if for some of the methods `EVMScriptEncoder` will not find ABI, `encodeEVMScript` will fail with error.
