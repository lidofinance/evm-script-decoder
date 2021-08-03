import test from 'ava'
import { ABIProvider } from '../src/ABIProvider'
import { ABIElement, ABIProviderStrategy } from '../src/types'
import { instance, mock, verify, when } from 'ts-mockito'

const TEST_ADDRESS = '0x07804b6667d649c819dfa94af50c782c26f5abc3'
const NOT_REGISTERED_ADDRESS = '0xaabbccddeeff49c819dfa94af50c782c26f5abc3'
const TEST_ABI_ELEMENT: ABIElement = {
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
}

const strategyMock: ABIProviderStrategy = mock<ABIProviderStrategy>()
when(strategyMock.getABI(NOT_REGISTERED_ADDRESS)).thenReject(new Error('Incorrect address'))
when(strategyMock.getABI(TEST_ADDRESS)).thenResolve([TEST_ABI_ELEMENT])
const strategyMockInstance = instance(strategyMock)

test('addStrategy() adds strategy to list', async (t) => {
  const abiProvider = new ABIProvider()
  t.is(await abiProvider.getABI(TEST_ADDRESS), undefined)
  abiProvider.addStrategy(strategyMockInstance)
  t.deepEqual(await abiProvider.getABI(TEST_ADDRESS), [TEST_ABI_ELEMENT])
})

test('getABI() returns undefined if strategy throws error', async (t) => {
  const abiProvider = new ABIProvider()
  abiProvider.addStrategy(strategyMockInstance)
  t.is(await abiProvider.getABI(NOT_REGISTERED_ADDRESS), undefined)
  await verify(strategyMock.getABI(NOT_REGISTERED_ADDRESS)).once()
})
