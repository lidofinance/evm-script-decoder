import { Address, EVMScriptEncoded } from '../src/types'

export const ETHERSCAN_API_KEY = 'T7E7J4JUY49ZJBGB8QT9I4YHJKUEFTP3ZA'

export const VERIFIED_CONTRACT = '0x07804b6667d649c819dfa94af50c782c26f5abc3'
export const NOT_CONTRACT_ADDRESS = '0x8EcF1A208E79B300C33895B62462ffb5b55627E5'
export const NOT_VERIFIED_CONTRACT = '0xbf8487c2ba87de9f7145ae2f57932bed4e6032cd'

export const CONTRACT_ABI = [
  {
    constant: false,
    inputs: [
      { name: '_id', type: 'uint256' },
      { name: '_stakingLimit', type: 'uint64' },
    ],
    name: 'setNodeOperatorStakingLimit',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
export const LOCAL_EVM_SCRIPT_EXAMPLE =
  '0x000000017899ef901ed9b331baf7759c15d2e8728e8c2a2c00000044ae962acf000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000c9'
export const REMOTE_EVM_SCRIPT_EXAMPLE =
  '0x0000000107804b6667d649c819dfa94af50c782c26f5abc300000024945233e2000000000000000000000000922c10dafffb8b9be4c40d3829c8c708a12827f3'
export const REMOTE_EVM_SCRIPT_EXAMPLE_NOT_CONTRACT =
  '0x000000018EcF1A208E79B300C33895B62462ffb5b55627E500000024945233e2000000000000000000000000922c10dafffb8b9be4c40d3829c8c708a12827f3'

export function createEVMScriptExample(address: Address): EVMScriptEncoded {
  const addressTrimmed = address.startsWith('0x') ? address.slice(2) : address
  return (
    '0x00000001' +
    addressTrimmed +
    '00000024' +
    '945233e2000000000000000000000000922c10dafffb8b9be4c40d3829c8c708a12827f3'
  )
}
