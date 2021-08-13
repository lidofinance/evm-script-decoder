"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultImplMethodNames = exports.ProxyABIMiddleware = void 0;
function ProxyABIMiddleware(config) {
    const { loadImplAddress } = config;
    return async (ctx) => {
        const { abi, address, abiProvider } = ctx;
        const implMethodNames = config.implMethodNames || exports.DefaultImplMethodNames;
        const implMethod = abi.find((abi) => implMethodNames.includes(abi.name));
        if (implMethod) {
            const implAddr = await loadImplAddress(address, implMethod);
            return abiProvider.getABI(implAddr);
        }
        return abi;
    };
}
exports.ProxyABIMiddleware = ProxyABIMiddleware;
exports.DefaultImplMethodNames = Object.freeze(['implementation']);
