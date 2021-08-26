import { ABIProviderMiddlewareContext } from './ABIProvider'
import { ABIElement, Address } from './types'

interface ProxyABIMiddlewareConfig {
  implMethodNames?: string[]
  loadImplAddress(proxyAddress: Address, implMethodAbi: ABIElement): Promise<Address | undefined>
}

const DefaultImplMethodNames = Object.freeze(['implementation'])

export function ProxyABIMiddleware(config: ProxyABIMiddlewareConfig) {
  const { loadImplAddress } = config
  return async (ctx: ABIProviderMiddlewareContext) => {
    const { abi, address, abiProvider } = ctx
    const implMethodNames = config.implMethodNames || DefaultImplMethodNames
    const implMethod = abi.find((abi) => implMethodNames.includes(abi.name))

    if (implMethod) {
      const implAddr = await loadImplAddress(address, implMethod)
      return abiProvider.getABI(implAddr)
    }
    return abi
  }
}

ProxyABIMiddleware.DefaultImplMethodNames = DefaultImplMethodNames
