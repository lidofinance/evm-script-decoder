import test from 'ava'
import { EVMScriptParser } from '../src/EVMScriptParser'

const SPEC_ID = '0x00000001'
const ADDRESS = '07804b6667d649c819dfa94af50c782c26f5abc3'
const CALL_DATA_LENGTH = '00000024'
const METHOD_ID = '945233e2'
const CALL_DATA = '000000000000000000000000922c10dafffb8b9be4c40d3829c8c708a12827f3'
const EVM_SCRIPT =
  SPEC_ID +
  ADDRESS +
  CALL_DATA_LENGTH +
  METHOD_ID +
  CALL_DATA +
  ADDRESS +
  CALL_DATA_LENGTH +
  METHOD_ID +
  CALL_DATA

test('Parse empty EVMScript', (t) => {
  const specId = '0x00000001'
  const r = EVMScriptParser.parse(specId)
  t.is(r.calls.length, 0)
  t.is(r.specId, '0x00000001')
})

test('Parse invalid EVMScript', (t) => {
  const specId = '00000001'
  t.throws(() => EVMScriptParser.parse(specId), { message: 'Invalid EVMScript' })
})

test('Parse EVMScript many calls', (t) => {
  const r = EVMScriptParser.parse(EVM_SCRIPT)
  t.is(r.specId, SPEC_ID)
  t.is(r.calls.length, 2)

  t.is(r.calls[0].address, '0x' + ADDRESS)
  t.is(r.calls[0].callDataLength, Number('0x' + CALL_DATA_LENGTH))
  t.is(r.calls[0].methodId, '0x' + METHOD_ID)
  t.is(r.calls[0].encodedCallData, '0x' + CALL_DATA)

  t.is(r.calls[1].address, '0x' + ADDRESS)
  t.is(r.calls[1].callDataLength, Number('0x' + CALL_DATA_LENGTH))
  t.is(r.calls[1].methodId, '0x' + METHOD_ID)
  t.is(r.calls[1].encodedCallData, '0x' + CALL_DATA)
})
