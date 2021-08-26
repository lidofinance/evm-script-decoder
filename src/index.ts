import { ABIProviderEtherscan } from './ABIProviderEtherscan'
import { ABIProviderLocal } from './ABIProviderLocal'
import { ABIProvider } from './ABIProvider'
import { ProxyABIMiddleware } from './ProxyABIMiddleware'

export * from './EVMScriptDecoder'
export * from './EVMScriptParser'
export { DefaultImplMethodNames } from './ProxyABIMiddleware'

export const providers = {
  Etherscan: ABIProviderEtherscan,
  Local: ABIProviderLocal,
  Base: ABIProvider,
}

export const middlewares = {
  ProxyABIMiddleware,
}
