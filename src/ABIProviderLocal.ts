import { ABIProvider } from './ABIProvider'
import { ABIElement, Address } from './types'

export class ABIProviderLocal extends ABIProvider {
  constructor(abiByAddress: Record<string, ABIElement[]>) {
    super({
      fetcher: LocalFetcher(abiByAddress),
    })
  }
}

function LocalFetcher(abiByAddress: Record<string, ABIElement[]>) {
  const abis: Record<string, ABIElement[]> = {}
  for (const [address, abi] of Object.entries(abiByAddress)) {
    abis[address.toLowerCase()] = abi
  }
  return async (address: Address) => {
    if (!abis[address]) {
      throw new Error(`ABI for contract ${address} wasn't provided`)
    }
    return abis[address]
  }
}
