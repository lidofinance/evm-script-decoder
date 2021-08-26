import test from 'ava'
import { abiProviders } from '../src/index'
import { MethodABIProvider } from '../src/MethodABIProvider'
import { createFetchMock, fetchMock, TEST_ABI_ELEMENT, TEST_ADDRESS } from './_helpers'

test('retrieveMethodABI by methodId', async (t) => {
  const provider = new MethodABIProvider([
    new abiProviders.Etherscan({
      apiKey: 'MOCK_API_KEY',
      fetch: fetchMock,
    }),
  ])
  const methodABI = await provider.retrieveMethodABI(TEST_ADDRESS, { methodId: '0x945233e2' })
  t.deepEqual(methodABI, TEST_ABI_ELEMENT)
})

test('retrieveMethodABI by signature', async (t) => {
  const provider = new MethodABIProvider([
    new abiProviders.Etherscan({
      apiKey: 'MOCK_API_KEY',
      fetch: fetchMock,
    }),
  ])
  const methodABI = await provider.retrieveMethodABI(TEST_ADDRESS, {
    signature: 'removeRewardProgram(address)',
  })
  t.deepEqual(methodABI, TEST_ABI_ELEMENT)
})

test('retrieveMethodABI by methodName', async (t) => {
  const provider = new MethodABIProvider([
    new abiProviders.Etherscan({
      apiKey: 'MOCK_API_KEY',
      fetch: fetchMock,
    }),
  ])
  const methodABI = await provider.retrieveMethodABI(TEST_ADDRESS, {
    methodName: 'removeRewardProgram',
  })
  t.deepEqual(methodABI, TEST_ABI_ELEMENT)
})

test('retrieveMethodABI by wrong method info', async (t) => {
  const provider = new MethodABIProvider([
    new abiProviders.Etherscan({
      apiKey: 'MOCK_API_KEY',
      fetch: fetchMock,
    }),
  ])
  await t.throwsAsync(() => provider.retrieveMethodABI(TEST_ADDRESS, {}), {
    message: 'Invalid method info',
  })
})

test('retrieveMethodABI cached value', async (t) => {
  const { callsCount, fetch } = createFetchMock({
    status: 200,
    response: { message: 'OK', result: JSON.stringify([TEST_ABI_ELEMENT]) },
  })
  const provider = new MethodABIProvider([
    new abiProviders.Etherscan({
      fetch,
      apiKey: 'MOCK_API_KEY',
    }),
  ])
  t.is(callsCount(), 0)
  await provider.retrieveMethodABI(TEST_ADDRESS, {
    methodName: 'removeRewardProgram',
  })
  t.is(callsCount(), 1)
  await provider.retrieveMethodABI(TEST_ADDRESS, {
    methodName: 'removeRewardProgram',
  })
  t.is(callsCount(), 1)
})
