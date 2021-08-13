"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.middlewares = exports.providers = exports.DefaultImplMethodNames = void 0;
const ABIProviderEtherscan_1 = require("./ABIProviderEtherscan");
const ABIProviderLocal_1 = require("./ABIProviderLocal");
const ABIProviderRemote_1 = require("./ABIProviderRemote");
const ProxyABIMiddleware_1 = require("./ProxyABIMiddleware");
__exportStar(require("./EVMScriptDecoder"), exports);
__exportStar(require("./EVMScriptParser"), exports);
var ProxyABIMiddleware_2 = require("./ProxyABIMiddleware");
Object.defineProperty(exports, "DefaultImplMethodNames", { enumerable: true, get: function () { return ProxyABIMiddleware_2.DefaultImplMethodNames; } });
exports.providers = {
    Etherscan: ABIProviderEtherscan_1.ABIProviderEtherscan,
    Local: ABIProviderLocal_1.ABIProviderLocal,
    Remote: ABIProviderRemote_1.ABIProviderRemote,
};
exports.middlewares = {
    ProxyABIMiddleware: ProxyABIMiddleware_1.ProxyABIMiddleware,
};
