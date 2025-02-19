import test from 'ava'
import { defaultAbiCoder } from '@ethersproject/abi'
import { abiProviders, EVMScriptDecoder } from '../src/index'
import { TEST_ABI_ELEMENT, TEST_ADDRESS, NOT_REGISTERED_ADDRESS, fetchMock } from './_helpers'
import Treasury_abi from './_abi/Treasury.abi.json'
import DepositSecurityModule_abi from './_abi/DepositSecurityModule.abi.json'
import DualGovernance_abi from './_abi/DualGovernance.abi.json'

const REWARD_ADDRESS = '0x922c10dafffb8b9be4c40d3829c8c708a12827f3'

const EVMScript = (address: string) =>
  `0x00000001${address.slice(2)}00000024945233e2000000000000000000000000${REWARD_ADDRESS.slice(2)}`

const EVM_SCRIPT_WITH_NOT_REGISTERED_ADDRESS = EVMScript(NOT_REGISTERED_ADDRESS)
const EVM_SCRIPT_WITH_REGISTERED_ADDRESS = EVMScript(TEST_ADDRESS)
const DECODED_EVM_SCRIPT_COMPLETE = {
  specId: '0x00000001',
  calls: [
    {
      address: TEST_ADDRESS,
      callDataLength: 36,
      methodId: '0x945233e2',
      encodedCallData: '0x000000000000000000000000922c10dafffb8b9be4c40d3829c8c708a12827f3',
      abi: TEST_ABI_ELEMENT,
      decodedCallData: ['0x922C10dAfffb8B9bE4C40d3829C8c708a12827F3'],
    },
  ],
}

const DECODED_EVM_SCRIPT_INCOMPLETE = {
  specId: '0x00000001',
  calls: [
    {
      address: NOT_REGISTERED_ADDRESS,
      callDataLength: 36,
      methodId: '0x945233e2',
      encodedCallData: '0x000000000000000000000000922c10dafffb8b9be4c40d3829c8c708a12827f3',
      abi: undefined,
      decodedCallData: undefined,
    },
  ],
}

let globalFetch = globalThis.fetch
test.before(() => {
  // @ts-ignore
  globalThis.fetch = fetchMock
})

test.after(() => {
  globalThis.fetch = globalFetch
})

test('decodeEVMScript() local strategy address not registered', async (t) => {
  const evmScriptDecoder = new EVMScriptDecoder(
    new abiProviders.Local({
      [TEST_ADDRESS]: [TEST_ABI_ELEMENT],
    })
  )
  const decodedEVMScript = await evmScriptDecoder.decodeEVMScript(
    EVM_SCRIPT_WITH_NOT_REGISTERED_ADDRESS
  )
  t.deepEqual(decodedEVMScript, DECODED_EVM_SCRIPT_INCOMPLETE)
})

test('decodeEVMScript() local strategy address registered', async (t) => {
  const evmScriptDecoder = new EVMScriptDecoder(
    new abiProviders.Local({
      [TEST_ADDRESS]: [TEST_ABI_ELEMENT],
    })
  )
  const decodedEVMScript = await evmScriptDecoder.decodeEVMScript(
    EVM_SCRIPT_WITH_REGISTERED_ADDRESS
  )
  t.deepEqual(decodedEVMScript, DECODED_EVM_SCRIPT_COMPLETE)
})

test('decodeEVMScript() etherscan strategy address not registered', async (t) => {
  const evmScriptDecoder = new EVMScriptDecoder(
    new abiProviders.Etherscan({
      apiKey: 'ETHERSCAN_API_KEY',
    })
  )
  const decodedEVMScript = await evmScriptDecoder.decodeEVMScript(EVMScript(NOT_REGISTERED_ADDRESS))
  t.deepEqual(decodedEVMScript, DECODED_EVM_SCRIPT_INCOMPLETE)
})

test('decodeEVMScript() etherscan strategy address registered', async (t) => {
  const evmScriptDecoder = new EVMScriptDecoder(
    new abiProviders.Etherscan({
      apiKey: 'ETHERSCAN_API_KEY',
    })
  )
  const decodedEVMScript = await evmScriptDecoder.decodeEVMScript(EVMScript(TEST_ADDRESS))
  t.deepEqual(decodedEVMScript, DECODED_EVM_SCRIPT_COMPLETE)
})

test('encodeEVMScript() with methodId and encoded calldata', async (t) => {
  const decoder = new EVMScriptDecoder(
    new abiProviders.Etherscan({
      apiKey: 'ETHERSCAN_API_KEY',
    })
  )

  const encodedEVMScript = await decoder.encodeEVMScript({
    calls: [
      {
        address: TEST_ADDRESS,
        methodId: '0x945233e2',
        encodedCallData: defaultAbiCoder.encode(['address'], [REWARD_ADDRESS]),
      },
    ],
  })
  t.is(encodedEVMScript, EVMScript(TEST_ADDRESS))
})

test('encodeEVMScript() with signature and encoded calldata', async (t) => {
  const decoder = new EVMScriptDecoder(
    new abiProviders.Etherscan({
      apiKey: 'ETHERSCAN_API_KEY',
    })
  )

  const encodedEVMScript = await decoder.encodeEVMScript({
    calls: [
      {
        address: TEST_ADDRESS,
        signature: 'removeRewardProgram(address)',
        encodedCallData: defaultAbiCoder.encode(['address'], [REWARD_ADDRESS]),
      },
    ],
  })
  t.is(encodedEVMScript, EVMScript(TEST_ADDRESS))
})

test('encodeEVMScript() with method name and decoded calldata', async (t) => {
  const decoder = new EVMScriptDecoder(
    new abiProviders.Etherscan({
      apiKey: 'ETHERSCAN_API_KEY',
    })
  )

  const encodedEVMScript = await decoder.encodeEVMScript({
    calls: [
      {
        address: TEST_ADDRESS,
        methodName: 'removeRewardProgram',
        decodedCallData: [REWARD_ADDRESS],
      },
    ],
  })
  t.is(encodedEVMScript, EVMScript(TEST_ADDRESS))
})

test('encodeEVMScript() without providers', async (t) => {
  const decoder = new EVMScriptDecoder()

  const encodedEVMScript = await decoder.encodeEVMScript({
    calls: [
      {
        address: TEST_ADDRESS,
        signature: 'removeRewardProgram(address)',
        encodedCallData: defaultAbiCoder.encode(['address'], [REWARD_ADDRESS]),
      },
    ],
  })
  t.is(encodedEVMScript, EVMScript(TEST_ADDRESS))
})

test('encodeEVMScript() with default address', async (t) => {
  const decoder = new EVMScriptDecoder(
    new abiProviders.Etherscan({
      apiKey: 'ETHERSCAN_API_KEY',
    })
  )

  const encodedEVMScript = await decoder.encodeEVMScript({
    address: TEST_ADDRESS,
    calls: [
      {
        methodName: 'removeRewardProgram',
        decodedCallData: [REWARD_ADDRESS],
      },
    ],
  })
  t.is(encodedEVMScript, EVMScript(TEST_ADDRESS))
})

test('encodeEVMScript() method not found', async (t) => {
  const decoder = new EVMScriptDecoder(
    new abiProviders.Etherscan({
      apiKey: 'ETHERSCAN_API_KEY',
    })
  )
  await t.throwsAsync(
    () =>
      decoder.encodeEVMScript({
        calls: [
          {
            address: NOT_REGISTERED_ADDRESS,
            methodName: 'removeRewardProgram',
            decodedCallData: [REWARD_ADDRESS],
          },
        ],
      }),
    { message: 'Method ABI for method "removeRewardProgram" not found' }
  )
})

const TREASURY_ADDRESS = '0x4333218072D5d7008546737786663c38B4D561A4'
const DEPOSIT_SECURITY_MODULE_ADDRESS = '0x7dc1c1ff64078f73c98338e2f17d1996ffbb2ede'
const SCRIPT_WITH_NESTED_SCRIPT =
  '0x000000014333218072d5d7008546737786663c38b4d561a400000084d948d46800000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000040000000017dc1c1ff64078f73c98338e2f17d1996ffbb2ede0000002460c8a547000000000000000000000000000000000000000000000000000000000000007b'
const ENCODED_NESTED_CALL_DATA = '123'

test('Parse nested EVMScript', async (t) => {
  const decoder = new EVMScriptDecoder(
    new abiProviders.Local({
      [TREASURY_ADDRESS]: Treasury_abi as any,
      [DEPOSIT_SECURITY_MODULE_ADDRESS]: DepositSecurityModule_abi as any,
    })
  )
  const r = await decoder.decodeEVMScript(SCRIPT_WITH_NESTED_SCRIPT)

  t.is(r.calls[0].decodedCallData?.[0].calls.length, 1)
  t.is(r.calls[0].decodedCallData?.[0].calls[0].address, DEPOSIT_SECURITY_MODULE_ADDRESS)
  t.is(r.calls[0].decodedCallData?.[0].calls[0].decodedCallData[0], ENCODED_NESTED_CALL_DATA)
})

const DG_ADDRESS = '0xb291a7f092d5cce0a3c93ea21bda3431129db202'
const DG_SCRIPT =
  '0x00000001fd1e42595cec3e83239bf8dfc535250e7f48e0bc000000649d0effdb000000000000000000000000da7d2573df555002503f29aa4003e398d28cc00f0000000000000000000000003f1c547b21f65e10480de3ad8e19faac46c95034a42eee1333c0758ba72be38e728b6dadb32ea767de5b4ddbaea1dae85b1b051ffd1e42595cec3e83239bf8dfc535250e7f48e0bc000000640a8ed3db000000000000000000000000e92329ec7ddb11d25e25b3c21eebf11f15eb325d0000000000000000000000003f1c547b21f65e10480de3ad8e19faac46c95034a42eee1333c0758ba72be38e728b6dadb32ea767de5b4ddbaea1dae85b1b051ffd1e42595cec3e83239bf8dfc535250e7f48e0bc00000064afd925df000000000000000000000000e92329ec7ddb11d25e25b3c21eebf11f15eb325d0000000000000000000000003f1c547b21f65e10480de3ad8e19faac46c95034a42eee1333c0758ba72be38e728b6dadb32ea767de5b4ddbaea1dae85b1b051fe92329ec7ddb11d25e25b3c21eebf11f15eb325d000000a4d948d4680000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000006000000001c7cc160b58f8bb0bac94b80847e2cf2800565c50000000442f2ff15d139c2898040ef16910dc9f44dc697df79363da767d8bc92f2e310312b816e46d000000000000000000000000c2764655e3fe0bd2d3c710d74fa5a89162099fd8e92329ec7ddb11d25e25b3c21eebf11f15eb325d000000a4d948d4680000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000006000000001c7cc160b58f8bb0bac94b80847e2cf2800565c50000000442f2ff15d2fc10cc8ae19568712f7a176fb4978616a610650813c9d05326c34abb62749c7000000000000000000000000c2764655e3fe0bd2d3c710d74fa5a89162099fd8e92329ec7ddb11d25e25b3c21eebf11f15eb325d000000a4d948d4680000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000006000000001091c0ec8b4d54a9fcb36269b5d5e5af43309e666000000442f2ff15d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000da7d2573df555002503f29aa4003e398d28cc00f091c0ec8b4d54a9fcb36269b5d5e5af43309e66600000044d547741f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e92329ec7ddb11d25e25b3c21eebf11f15eb325dfd1e42595cec3e83239bf8dfc535250e7f48e0bc000000640a8ed3db000000000000000000000000d5ee9991f44b36e186a658dc2a0357eccf11b69b000000000000000000000000e92329ec7ddb11d25e25b3c21eebf11f15eb325db421f7ad7646747f3051c50c0b8e2377839296cd4973e27f63821d73e390338f0f8826a574bcfdc4997939076f6d82877971feb300000044221e2efc000000000000000000000000d5ee9991f44b36e186a658dc2a0357eccf11b69b000000000000000000000000c2764655e3fe0bd2d3c710d74fa5a89162099fd8b291a7f092d5cce0a3c93ea21bda3431129db2020000020453e51f8b000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001e000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000e92329ec7ddb11d25e25b3c21eebf11f15eb325d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000c4d948d4680000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000007c00000001c3fc22c7e0d20247b797fb6dc743bd3879217c8100000004febb0f7e3db5aba48123bb8789f6f09ec714e7082bc267470000004491f0004c0000000000000000000000000000000000000000000000000000000000007080000000000000000000000000000000000000000000000000000000000001194000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
const TUPLE_CALLDATA =
  '0xd948d4680000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000007c00000001c3fc22c7e0d20247b797fb6dc743bd3879217c8100000004febb0f7e3db5aba48123bb8789f6f09ec714e7082bc267470000004491f0004c0000000000000000000000000000000000000000000000000000000000007080000000000000000000000000000000000000000000000000000000000001194000000000'

test('Parse script with complex inputs', async (t) => {
  const decoder = new EVMScriptDecoder(
    new abiProviders.Local({
      [DG_ADDRESS]: DualGovernance_abi as any,
    })
  )
  const r = await decoder.decodeEVMScript(DG_SCRIPT)

  const callWithTuple = r.calls[r.calls.length - 1]
  const decodedTuple = callWithTuple.decodedCallData?.[0][0]

  t.is(decodedTuple.length, 3)
  t.is(decodedTuple[0], '0xE92329EC7ddB11D25e25b3c21eeBf11f15eB325d')
  t.is(decodedTuple[1], '0')
  t.is(decodedTuple[2], TUPLE_CALLDATA)
})
