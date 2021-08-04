"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVMScriptDecoder = void 0;
const abi_1 = require("@ethersproject/abi");
const EVMScriptParser_1 = require("./EVMScriptParser");
const MethodABIProvider_1 = require("./MethodABIProvider");
const DEFAULT_SPEC_ID = '0x00000001';
class EVMScriptDecoder {
    constructor(config = {}) {
        this.methodABIProvider = new MethodABIProvider_1.MethodABIProvider(config);
    }
    async decodeEVMScript(evmScript) {
        const parsedScript = EVMScriptParser_1.EVMScriptParser.parse(evmScript);
        for (const call of parsedScript.calls) {
            call.abi = await this.methodABIProvider.retrieveMethodABI({
                address: call.address,
                method: call.methodId,
            });
            call.decodedCallData = await this.decodeFunctionData(call);
        }
        return parsedScript;
    }
    async encodeEVMScript(...args) {
        if (Array.isArray(args[0])) {
            return this.encodeEVMScriptDifferentCalls(args[0], args[1]);
        }
        if (Array.isArray(args[1])) {
            return this.encodeEVMScriptOneAddressManyCalls(args[0], args[1], args[2]);
        }
        return this.encodeEVMScriptOneCall(args[0], args[1], args[2], args[3]);
    }
    async encodeEVMScriptOneCall(address, method, params, specId = DEFAULT_SPEC_ID) {
        return this.encodeEVMScriptDifferentCalls([{ address, method, params }], specId);
    }
    async encodeEVMScriptOneAddressManyCalls(address, calls, specId = DEFAULT_SPEC_ID) {
        return this.encodeEVMScriptDifferentCalls(calls.map((c) => ({ ...c, address })), specId);
    }
    async encodeEVMScriptDifferentCalls(calls, specId = DEFAULT_SPEC_ID) {
        let evmScript = specId;
        for (const evmScriptCallInput of calls) {
            const { address, params } = evmScriptCallInput;
            const methodABI = await this.methodABIProvider.retrieveMethodABI(evmScriptCallInput);
            if (!methodABI) {
                throw new Error(`ABI for method ${evmScriptCallInput.method} not found on address ${address}`);
            }
            const encodedCallData = this.encodeFunctionData(methodABI, params).slice(2);
            const callDataLength = Number(encodedCallData.length / 2)
                .toString(16)
                .padStart(8, '0');
            evmScript += address.slice(2) + callDataLength + encodedCallData;
        }
        return evmScript;
    }
    encodeFunctionData(methodABI, params) {
        const i = new abi_1.Interface(JSON.stringify([methodABI]));
        return i.encodeFunctionData(methodABI.name, params);
    }
    async decodeFunctionData(data) {
        const abi = await this.methodABIProvider.retrieveMethodABI({
            address: data.address,
            method: data.methodId,
        });
        if (!abi) {
            return undefined;
        }
        const i = new abi_1.Interface(JSON.stringify([abi]));
        return Array.from(i.decodeFunctionData(abi.name, data.methodId + data.encodedCallData.substring(2))).map((param) => ((param === null || param === void 0 ? void 0 : param._isBigNumber) ? param.toString() : param));
    }
}
exports.EVMScriptDecoder = EVMScriptDecoder;
