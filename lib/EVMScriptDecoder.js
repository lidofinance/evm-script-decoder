"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVMScriptDecoder = void 0;
const EVMScriptParser_1 = require("./EVMScriptParser");
const MethodABIProvider_1 = require("./MethodABIProvider");
const MethodInfo_1 = require("./MethodInfo");
const DEFAULT_SPEC_ID = '0x00000001';
class EVMScriptDecoder {
    constructor(providers = []) {
        this.methodABIProvider = new MethodABIProvider_1.MethodABIProvider(providers);
    }
    async decodeEVMScript(evmScript) {
        const parsedScript = EVMScriptParser_1.EVMScriptParser.parse(evmScript);
        for (const call of parsedScript.calls) {
            const methodInfo = (await this.findMethodInfo(call.address, {
                methodId: call.methodId,
            }));
            call.abi = methodInfo === null || methodInfo === void 0 ? void 0 : methodInfo.abi;
            call.decodedCallData = await (methodInfo === null || methodInfo === void 0 ? void 0 : methodInfo.decodeMethodParams(call.encodedCallData));
        }
        return parsedScript;
    }
    async encodeEVMScript(evmScript) {
        let evmScriptEncoded = evmScript.specId || DEFAULT_SPEC_ID;
        for (const evmScriptCallInput of evmScript.calls) {
            evmScriptEncoded += await this.encodeEVMScriptCall(evmScriptCallInput, evmScript.address);
        }
        return evmScriptEncoded;
    }
    async encodeEVMScriptCall(evmScriptCall, defaultAddress) {
        let { address = defaultAddress, encodedCallData, methodId } = evmScriptCall;
        let methodInfo;
        if (encodedCallData === undefined) {
            methodInfo = await this.getMethodInfo(address, evmScriptCall);
            encodedCallData = methodInfo.encodeMethodParams(evmScriptCall.decodedCallData);
        }
        if (!methodId) {
            methodInfo = methodInfo !== null && methodInfo !== void 0 ? methodInfo : (await this.getMethodInfo(address, evmScriptCall));
            methodId = methodInfo.methodId;
        }
        const callDataLength = Number(encodedCallData.length / 2 - 1 + 4)
            .toString(16)
            .padStart(8, '0');
        return address.slice(2) + callDataLength + methodId.slice(2) + encodedCallData.slice(2);
    }
    async getMethodInfo(address, methodInfo) {
        const res = await this.findMethodInfo(address, methodInfo);
        if (!res) {
            throw new Error(`Method ABI for method "${methodInfo.methodId || methodInfo.methodName}" not found`);
        }
        return res;
    }
    async findMethodInfo(address, methodInfo) {
        if (methodInfo.signature) {
            return new MethodInfo_1.SignatureMethodInfo(address, methodInfo.signature);
        }
        const methodABI = await this.methodABIProvider.retrieveMethodABI(address, methodInfo);
        if (methodABI) {
            return new MethodInfo_1.ABIMethodInfo(address, methodABI);
        }
    }
}
exports.EVMScriptDecoder = EVMScriptDecoder;
