import test from 'ava'
import { ABICache } from '../src/ABICache'
import { ABIElement } from '../src/types'

const TEST_ADDRESS = '0x07804b6667d649c819dfa94af50c782c26f5abc3'
const TEST_ABI: ABIElement[] = [
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
  {
    inputs: [],
    name: 'MIN_TIEBREAKER_ACTIVATION_TIMEOUT',
    outputs: [
      {
        internalType: 'Duration',
        name: '',
        type: 'uint32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'proposerAccount',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'newExecutor',
        type: 'address',
      },
    ],
    name: 'setProposerExecutor',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'target',
            type: 'address',
          },
          {
            internalType: 'uint96',
            name: 'value',
            type: 'uint96',
          },
          {
            internalType: 'bytes',
            name: 'payload',
            type: 'bytes',
          },
        ],
        internalType: 'struct ExternalCall[]',
        name: 'calls',
        type: 'tuple[]',
      },
      {
        internalType: 'string',
        name: 'metadata',
        type: 'string',
      },
    ],
    name: 'submitProposal',
    outputs: [
      {
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
const ABI_MAP = {
  '0x945233e2': TEST_ABI[0],
  '0x7e5c49cf': TEST_ABI[1],
  '0x25e62b1c': TEST_ABI[2],
  '0x53e51f8b': TEST_ABI[3],
}

test('has() returns false when address not listed in cache', (t) => {
  const abiCache = new ABICache()
  t.false(abiCache.has(TEST_ADDRESS))
})

test('has() returns true when address listed in cache', (t) => {
  const abiCache = new ABICache()
  abiCache.add(TEST_ADDRESS, TEST_ABI)
  t.true(abiCache.has(TEST_ADDRESS))
})

test('get() returns undefined when abi for address not in cache', (t) => {
  const abiCache = new ABICache()
  t.is(abiCache.get(TEST_ADDRESS), undefined)
})

test('add()/get() returns correct map of abi elements for address when it was added to cache', (t) => {
  const abiCache = new ABICache()
  abiCache.add(TEST_ADDRESS, TEST_ABI)
  t.deepEqual(abiCache.get(TEST_ADDRESS), ABI_MAP)
})
