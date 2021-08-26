import { ABIProviderEtherscan } from './ABIProviderEtherscan'
import { ABIProviderLocal } from './ABIProviderLocal'
import { ABIProvider } from './ABIProvider'
import { ProxyABIMiddleware } from './ProxyABIMiddleware'

export * from './EVMScriptDecoder'
export * from './EVMScriptParser'

export const abiProviders = {
  Base: ABIProvider,
  Local: ABIProviderLocal,
  Etherscan: ABIProviderEtherscan,
  middlewares: {
    ProxyABIMiddleware,
  },
}
