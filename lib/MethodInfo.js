"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ABIMethodInfo = exports.SignatureMethodInfo = void 0;
const abi_1 = require("@ethersproject/abi");
const keccak256_1 = __importDefault(require("keccak256"));
class SignatureMethodInfo {
    constructor(address, signature) {
        this.address = address;
        this.signature = signature;
        const signatureParamsRegex = /\(([a-zA-Z0-9,()]*)\)/i;
        const [, signatureParams] = signature.match(signatureParamsRegex);
        this.params = signatureParams.split(',');
        this.methodId = '0x' + keccak256_1.default(signature).toString('hex').slice(0, 8);
    }
    encodeMethodParams(decodedParams) {
        return abi_1.defaultAbiCoder.encode(this.params, decodedParams);
    }
    decodeMethodParams(encodedParams) {
        return abi_1.defaultAbiCoder
            .decode(this.params, encodedParams)
            .map((param) => ((param === null || param === void 0 ? void 0 : param._isBigNumber) ? param.toString() : param));
    }
}
exports.SignatureMethodInfo = SignatureMethodInfo;
class ABIMethodInfo extends SignatureMethodInfo {
    constructor(address, abi) {
        super(address, `${abi.name}(${abi.inputs.map((i) => i.type).join(',')})`);
        this.abi = abi;
    }
}
exports.ABIMethodInfo = ABIMethodInfo;
