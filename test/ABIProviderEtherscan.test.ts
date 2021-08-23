import test from 'ava'
import {
  TEST_ADDRESS,
  fetchMockErrorResponse,
  fetchMockInvalidAPIKey,
  createFetchMock,
  TEST_ABI_ELEMENT,
  fetchMock,
} from './_helpers'
import { middlewares, providers } from '../src/index'

test('getABI() request failed', async (t) => {
  const provider = new providers.Etherscan({
    apiKey: 'MOCK_API_KEY',
    fetch: fetchMockErrorResponse,
  })
  await t.throwsAsync(() => provider.getABI(TEST_ADDRESS), {
    message: 'Etherscan request failed. Status code 401',
  })
})

test('getABI() creates correct url', async (t) => {
  const { calledWith, fetch } = createFetchMock({
    status: 200,
    response: { message: 'OK', result: JSON.stringify([TEST_ABI_ELEMENT]) },
  })
  const provider = new providers.Etherscan({
    apiKey: 'MOCK_API_KEY',
    network: 'rinkeby',
    fetch,
  })
  await provider.getABI(TEST_ADDRESS)
  t.true(calledWith().startsWith('https://api-rinkeby.etherscan.io/api'))
  t.true(calledWith().includes('address=0x07804b6667d649c819dfa94af50c782c26f5abc3'))
  t.true(calledWith().includes('apikey=MOCK_API_KEY'))
})

test('getABI() etherscan response is NOTOK', async (t) => {
  const provider = new providers.Etherscan({
    apiKey: 'MOCK_API_KEY',
    fetch: fetchMockInvalidAPIKey,
  })
  await t.throwsAsync(() => provider.getABI(TEST_ADDRESS), {
    message: 'Invalid API Key',
  })
})

test('getABI() with middlewares', async (t) => {
  let isMiddlewareCalled = false
  const provider = new providers.Etherscan({
    apiKey: 'MOCK_API_KEY',
    fetch: fetchMock,
    middlewares: [
      async (ctx) => {
        isMiddlewareCalled = true
        return ctx.abi
      },
    ],
  })
  await provider.getABI(TEST_ADDRESS)
  t.true(isMiddlewareCalled)
})
