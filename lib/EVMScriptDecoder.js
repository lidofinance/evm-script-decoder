"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVMScriptDecoder = void 0;
const EVMScriptParser_1 = require("./EVMScriptParser");
const MethodABIProvider_1 = require("./MethodABIProvider");
const FullMethodInfo_1 = require("./FullMethodInfo");
const DEFAULT_SPEC_ID = '0x00000001';
class EVMScriptDecoder {
    constructor(...providers) {
        this.methodABIProvider = new MethodABIProvider_1.MethodABIProvider(providers);
    }
    async decodeEVMScript(evmScript) {
        var _a;
        const parsedScript = EVMScriptParser_1.EVMScriptParser.parse(evmScript);
        for (const call of parsedScript.calls) {
            const methodInfo = await this.findMethodInfo(call.address, {
                methodId: call.methodId,
            });
            call.abi = methodInfo === null || methodInfo === void 0 ? void 0 : methodInfo.abi;
            const rawParams = await (methodInfo === null || methodInfo === void 0 ? void 0 : methodInfo.decodeMethodParams(call.encodedCallData));
            const formattedParams = await this.formatDecodedParams(rawParams, (_a = call === null || call === void 0 ? void 0 : call.abi) === null || _a === void 0 ? void 0 : _a.inputs);
            call.decodedCallData = formattedParams;
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
    async formatDecodedParams(rawParams, inputs) {
        if (!rawParams)
            return rawParams;
        const formatters = rawParams.map((param, i) => {
            if (param === null || param === void 0 ? void 0 : param._isBigNumber)
                return param.toString();
            if (inputs && inputs[i].name === '_evmScript')
                return this.decodeEVMScript(param);
            return param;
        });
        const formatted = await Promise.all(formatters);
        return formatted;
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
            return FullMethodInfo_1.FullMethodInfo.fromSignature(address, methodInfo.signature);
        }
        const methodABI = await this.methodABIProvider.retrieveMethodABI(address, methodInfo);
        if (methodABI) {
            return FullMethodInfo_1.FullMethodInfo.fromABI(address, methodABI);
        }
    }
}
exports.EVMScriptDecoder = EVMScriptDecoder;
