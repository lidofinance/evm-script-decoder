import { EVMScriptParsed } from './types';
export declare const EVMScriptParser: {
    parse(evmScript: string): {
        specId: string;
        calls: EVMScriptParsed[];
    };
};
