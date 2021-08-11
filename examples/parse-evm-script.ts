import { EVMScriptParser } from '../src/index'
import { LOCAL_EVM_SCRIPT_EXAMPLE } from './constants'
async function main() {
  const parsedEVMScript = EVMScriptParser.parse(LOCAL_EVM_SCRIPT_EXAMPLE)
  console.log('Example of parsing of EVMScript:')
  console.dir(parsedEVMScript, { depth: 3 })
}

main()
