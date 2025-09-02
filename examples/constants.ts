import { Address, EVMScriptEncoded } from '../src/types'

export const ETHERSCAN_API_KEY = 'ETHERSCAN_API_KEY_HERE'
export const RPC_URL = 'https://eth.drpc.org'

export const VERIFIED_CONTRACT = '0x55032650b14df07b85bF18A3a3eC8E0Af2e028d5'
export const NOT_CONTRACT_ADDRESS = '0x8EcF1A208E79B300C33895B62462ffb5b55627E5'
export const NOT_VERIFIED_CONTRACT = '0x7E42958F20fCf3949D9eaa3C03f4e488cEd5f1E4'
export const VERIFIED_NON_PROXY_CONTRACT = '0xF0211b7660680B49De1A7E9f25C65660F0a13Fea'

export const CONTRACT_ABI = [
  {
    constant: false,
    inputs: [
      { name: '_nodeOperatorId', type: 'uint256' },
      { name: '_vettedSigningKeysCount', type: 'uint64' },
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
  '0x0000000155032650b14df07b85bF18A3a3eC8E0Af2e028d500000024945233e2000000000000000000000000922c10dafffb8b9be4c40d3829c8c708a12827f3'
export const REMOTE_EVM_SCRIPT_EXAMPLE_NOT_CONTRACT =
  '0x000000018EcF1A208E79B300C33895B62462ffb5b55627E500000024945233e2000000000000000000000000922c10dafffb8b9be4c40d3829c8c708a12827f3'

export function createEVMScriptExample(address: Address): EVMScriptEncoded {
  const addressTrimmed = address.startsWith('0x') ? address.slice(2) : address
  return (
    '0x00000001' +
    addressTrimmed +
    '00000024' +
    'b2223eb50000000000000000000000008ecf1a208e79b300c33895b62462ffb5b55627e5'
  )
}
