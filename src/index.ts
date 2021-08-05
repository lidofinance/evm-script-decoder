import { ABIProviderEtherscan } from './ABIProviderEtherscan'
import { ABIProviderLocal } from './ABIProviderLocal'
export * from './EVMScriptDecoder'
export * from './EVMScriptParser'

export const providers = {
  Etherscan: ABIProviderEtherscan,
  Local: ABIProviderLocal,
}
