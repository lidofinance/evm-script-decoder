import test from 'ava'
import { middlewares, providers } from '../src/index'
import { ABIElement, Address } from '../src/types'
import { fetchMock, NOT_REGISTERED_ADDRESS, TEST_ABI_ELEMENT, TEST_ADDRESS } from './_helpers'

test('called on contract with implementation method', async (t) => {
  let passedProxyAddress: Address
  let passedImplMethodAbi: ABIElement
  const config = {
    implMethodNames: ['removeRewardProgram'],
    loadImplAddress: async (proxyAddress, implMethodAbi) => {
      passedProxyAddress = proxyAddress
      passedImplMethodAbi = implMethodAbi
      return TEST_ADDRESS
    },
  }
  const middleware = middlewares.ProxyABIMiddleware(config)
  const ctx = {
    abiProvider: new providers.Etherscan({ apiKey: 'MOCK_API_KEY', fetch: fetchMock }),
    address: TEST_ADDRESS,
    abi: [TEST_ABI_ELEMENT],
  }
  const implementationAbi = await middleware(ctx)
  // validate that was returned value not from passed ctx
  t.not(implementationAbi, ctx.abi)
  // validate that was returned correct implementation
  t.deepEqual(implementationAbi, [TEST_ABI_ELEMENT])
  // validate that loadImplAddress was called with correct params
  t.is(passedProxyAddress, TEST_ADDRESS)
  t.deepEqual(passedImplMethodAbi, TEST_ABI_ELEMENT)
})

test('called on contract without implementation method', async (t) => {
  let passedProxyAddress: Address
  let passedImplMethodAbi: ABIElement
  const config = {
    implMethodNames: ['notListedAddress'],
    loadImplAddress: async (proxyAddress, implMethodAbi) => {
      passedProxyAddress = proxyAddress
      passedImplMethodAbi = implMethodAbi
      return NOT_REGISTERED_ADDRESS
    },
  }
  const middleware = middlewares.ProxyABIMiddleware(config)
  const ctx = {
    abiProvider: new providers.Etherscan({ apiKey: 'MOCK_API_KEY', fetch: fetchMock }),
    address: TEST_ADDRESS,
    abi: [TEST_ABI_ELEMENT],
  }
  const implementationAbi = await middleware(ctx)
  // validate that was returned original abi element
  t.is(implementationAbi, ctx.abi)
  // validate that methods wasn't called
  t.is(passedProxyAddress, undefined)
  t.is(passedImplMethodAbi, undefined)
})
