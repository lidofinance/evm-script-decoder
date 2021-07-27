import { EVMScriptParsed } from './types'

const CHARS_PER_BYTE = 2
const METHOD_ID_SIZE = 4 * CHARS_PER_BYTE
const ADDRESS_SIZE = 20 * CHARS_PER_BYTE
const CALL_DATA_LENGTH_SIZE = 4 * CHARS_PER_BYTE

export const EVMScriptParser = {
  parse(evmScript: string) {
    if (!evmScript.startsWith('0x')) {
      throw new Error('Invalid EVMScript')
    }
    let startIndex = CHARS_PER_BYTE // skip 0x prefix in EVMScript bytes representation
    const res: { specId: string; calls: EVMScriptParsed[] } = {
      specId: getBytes(evmScript, startIndex, (startIndex += METHOD_ID_SIZE)),
      calls: [],
    }

    while (startIndex < evmScript.length) {
      const address = getBytes(evmScript, startIndex, (startIndex += ADDRESS_SIZE))
      const callDataLength = Number(
        getBytes(evmScript, startIndex, (startIndex += CALL_DATA_LENGTH_SIZE))
      )
      const callData = getBytes(
        evmScript,
        startIndex,
        (startIndex += CHARS_PER_BYTE * callDataLength)
      )
      res.calls.push({
        address,
        callDataLength,
        methodId: getBytes(callData, CHARS_PER_BYTE, CHARS_PER_BYTE + METHOD_ID_SIZE),
        encodedCallData: getBytes(callData, CHARS_PER_BYTE + METHOD_ID_SIZE),
      })
    }
    return res
  },
}

function getBytes(source: string, startIndex: number, endIndex?: number): string {
  return '0x' + source.substring(startIndex, endIndex)
}
