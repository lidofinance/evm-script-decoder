"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ABICache = void 0;
const keccak256_1 = __importDefault(require("keccak256"));
class ABICache {
    constructor() {
        // stores ABI elements by address by methodId
        this.data = {};
    }
    has(address) {
        return !!this.data[address];
    }
    get(contract) {
        return this.data[contract];
    }
    add(address, abi) {
        const abiByMethodIds = {};
        const onlyMethodsABI = abi.filter((a) => a.name && a.inputs);
        for (const abiElement of onlyMethodsABI) {
            const methodId = getMethodId(abiElement);
            abiByMethodIds[methodId] = abiElement;
        }
        this.data[address] = abiByMethodIds;
    }
}
exports.ABICache = ABICache;
function getMethodId(abiElement) {
    const signature = `${abiElement.name}(${abiElement.inputs.map((i) => i.type).join(',')})`;
    return '0x' + keccak256_1.default(signature).toString('hex').slice(0, 8);
}
