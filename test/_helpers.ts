import { ABIElement, Address } from '../src/types'

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

export function createFetchMock(config: { status: number; response?: any; error?: any }) {
  let calledWith: Address
  let callsCount = 0
  return {
    callsCount: () => callsCount,
    calledWith: () => calledWith,
    fetch: async (address: Address) => {
      callsCount += 1
      calledWith = address
      return {
        status: config.status,
        async json() {
          if (config.error) {
            throw config.error
          }
          return config.response
        },
      }
    },
  }
}

export async function fetchMock(address: string) {
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

export async function fetchMockErrorResponse(address: string) {
  return {
    status: 401,
    async json() {
      throw new Error('Not implemented')
    },
  }
}

export async function fetchMockInvalidAPIKey(address: string) {
  return {
    status: 200,
    async json() {
      return {
        status: 0,
        message: 'NOTOK',
        result: 'Invalid API Key',
      }
    },
  }
}
