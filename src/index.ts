import fetch from 'node-fetch'
if (!globalThis.fetch) {
  globalThis.fetch = fetch
}
export * from './EVMScriptDecoder'
export * from './EVMScriptParser'
