"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FullMethodInfo = void 0;
const abi_1 = require("@ethersproject/abi");
const keccak256_1 = __importDefault(require("keccak256"));
class FullMethodInfo {
    constructor(address, signature, abi) {
        this.address = address;
        this.signature = signature;
        const signatureParamsRegex = /\(([a-zA-Z0-9,\(\)\[\]]*)\)/i;
        const [, signatureParams] = signature.match(signatureParamsRegex);
        this.params = signatureParams.split(',');
        this.methodId = '0x' + keccak256_1.default(signature).toString('hex').slice(0, 8);
        this.abi = abi;
    }
    static fromABI(address, abi) {
        const signature = `${abi.name}(${abi.inputs.map((i) => i.type).join(',')})`;
        return new FullMethodInfo(address, signature, abi);
    }
    static fromSignature(address, signature) {
        return new FullMethodInfo(address, signature);
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
exports.FullMethodInfo = FullMethodInfo;
