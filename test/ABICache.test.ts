import test from 'ava'
import { ABICache } from '../src/ABICache'
import { ABIElement } from '../src/types'

const TEST_ADDRESS = '0x07804b6667d649c819dfa94af50c782c26f5abc3'
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
const EXPECTED_METHOD_ID = '0x945233e2'

test('has() returns false when address not listed in cache', (t) => {
  const abiCache = new ABICache()
  t.false(abiCache.has(TEST_ADDRESS))
})

test('has() returns true when address listed in cache', (t) => {
  const abiCache = new ABICache()
  abiCache.add(TEST_ADDRESS, [TEST_ABI_ELEMENT])
  t.true(abiCache.has(TEST_ADDRESS))
})

test('get() returns undefined when abi for address not in cache', (t) => {
  const abiCache = new ABICache()
  t.is(abiCache.get(TEST_ADDRESS), undefined)
})

test('add()/get() returns correct map of abi elements for address when it was added to cache', (t) => {
  const abiCache = new ABICache()
  abiCache.add(TEST_ADDRESS, [TEST_ABI_ELEMENT])
  t.deepEqual(abiCache.get(TEST_ADDRESS), { [EXPECTED_METHOD_ID]: TEST_ABI_ELEMENT })
})
