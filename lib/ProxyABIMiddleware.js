"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxyABIMiddleware = void 0;
const DefaultImplMethodNames = Object.freeze(['implementation']);
function ProxyABIMiddleware(config) {
    const { loadImplAddress } = config;
    return async (ctx) => {
        const { abi, address, abiProvider } = ctx;
        const implMethodNames = config.implMethodNames || DefaultImplMethodNames;
        const implMethod = abi.find((abi) => implMethodNames.includes(abi.name));
        if (implMethod) {
            const implAddr = await loadImplAddress(address, implMethod);
            return abiProvider.getABI(implAddr);
        }
        return abi;
    };
}
exports.ProxyABIMiddleware = ProxyABIMiddleware;
ProxyABIMiddleware.DefaultImplMethodNames = DefaultImplMethodNames;
