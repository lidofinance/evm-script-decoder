import { ABIElement } from '../src/types'

export const TEST_ADDRESS = '0x07804b6667d649c819dfa94af50c782c26f5abc3'
export const NOT_REGISTERED_ADDRESS = '0xaabbccddeeff49c819dfa94af50c782c26f5abc3'
export const TEST_ABI_ELEMENT: ABIElement = {
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
