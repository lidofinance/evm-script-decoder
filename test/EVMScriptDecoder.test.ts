import test from 'ava'
import { EVMScriptDecoder } from '../src/EVMScriptDecoder'
import { TEST_ABI_ELEMENT, TEST_ADDRESS, NOT_REGISTERED_ADDRESS } from './constants'

const REWARD_ADDRESS = '0x922c10dafffb8b9be4c40d3829c8c708a12827f3'

async function fetchMock(address: string) {
  return {
    status: 200,
    async json() {
      if (address.includes(TEST_ADDRESS)) {
        return { message: 'OK', result: JSON.stringify([TEST_ABI_ELEMENT]) }
      }
      throw new Error('UNKNOWN ADDRESS')
    },
  }
}

// @ts-ignore
globalThis.fetch = fetchMock

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

test('decodeEVMScript() local strategy address not registered', async (t) => {
  const evmScriptDecoder = new EVMScriptDecoder({
    abi: {
      [TEST_ADDRESS]: [TEST_ABI_ELEMENT],
    },
  })
  const decodedEVMScript = await evmScriptDecoder.decodeEVMScript(
    EVM_SCRIPT_WITH_NOT_REGISTERED_ADDRESS
  )
  t.deepEqual(decodedEVMScript, DECODED_EVM_SCRIPT_INCOMPLETE)
})

test('decodeEVMScript() local strategy address registered', async (t) => {
  const evmScriptDecoder = new EVMScriptDecoder({
    abi: {
      [TEST_ADDRESS]: [TEST_ABI_ELEMENT],
    },
  })
  const decodedEVMScript = await evmScriptDecoder.decodeEVMScript(
    EVM_SCRIPT_WITH_REGISTERED_ADDRESS
  )
  t.deepEqual(decodedEVMScript, DECODED_EVM_SCRIPT_COMPLETE)
})

test('decodeEVMScript() etherscan strategy address not registered', async (t) => {
  const evmScriptDecoder = new EVMScriptDecoder({
    etherscanApiKey: 'ETHERSCAN_API_KEY',
  })
  const decodedEVMScript = await evmScriptDecoder.decodeEVMScript(EVMScript(NOT_REGISTERED_ADDRESS))
  t.deepEqual(decodedEVMScript, DECODED_EVM_SCRIPT_INCOMPLETE)
})

test('decodeEVMScript() etherscan strategy address registered', async (t) => {
  const evmScriptDecoder = new EVMScriptDecoder({
    etherscanApiKey: 'ETHERSCAN_API_KEY',
  })
  const decodedEVMScript = await evmScriptDecoder.decodeEVMScript(EVMScript(TEST_ADDRESS))
  t.deepEqual(decodedEVMScript, DECODED_EVM_SCRIPT_COMPLETE)
})

test('encodeEVMScript() one method call with method name', async (t) => {
  const evmScriptDecoder = new EVMScriptDecoder({
    abi: {
      [TEST_ADDRESS]: [TEST_ABI_ELEMENT],
    },
  })
  const evmScript = await evmScriptDecoder.encodeEVMScript(TEST_ADDRESS, 'removeRewardProgram', [
    REWARD_ADDRESS,
  ])
  t.is(evmScript, EVMScript(TEST_ADDRESS))
})

test('encodeEVMScript() one address many calls with signature', async (t) => {
  const evmScriptDecoder = new EVMScriptDecoder({
    abi: {
      [TEST_ADDRESS]: [TEST_ABI_ELEMENT],
    },
  })
  const evmScript = await evmScriptDecoder.encodeEVMScript(TEST_ADDRESS, [
    { method: 'removeRewardProgram(address)', params: [REWARD_ADDRESS] },
  ])
  t.is(evmScript, EVMScript(TEST_ADDRESS))
})

test('encodeEVMScript() many calls with methodId', async (t) => {
  const evmScriptDecoder = new EVMScriptDecoder({
    abi: {
      [TEST_ADDRESS]: [TEST_ABI_ELEMENT],
    },
  })
  const evmScript = await evmScriptDecoder.encodeEVMScript([
    { address: TEST_ADDRESS, method: '0x945233e2', params: [REWARD_ADDRESS] },
  ])
  t.is(evmScript, EVMScript(TEST_ADDRESS))
})
