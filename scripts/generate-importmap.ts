import { generateImportMap } from '../node_modules/payload/dist/bin/generateImportMap/index.js'
import rawConfig from '../payload.config'

void (async () => {
  const config = await rawConfig
  await generateImportMap(config, { force: true })
  console.log('✓ importMap.js updated')
})()
