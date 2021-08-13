import { ABIProviderEtherscan } from './ABIProviderEtherscan'
import { ABIProviderLocal } from './ABIProviderLocal'
import { ABIProviderRemote } from './ABIProviderRemote'
import { ProxyABIMiddleware } from './ProxyABIMiddleware'

export * from './EVMScriptDecoder'
export * from './EVMScriptParser'
export { DefaultImplMethodNames } from './ProxyABIMiddleware'

export const providers = {
  Etherscan: ABIProviderEtherscan,
  Local: ABIProviderLocal,
  Remote: ABIProviderRemote,
}

export const middlewares = {
  ProxyABIMiddleware,
}
