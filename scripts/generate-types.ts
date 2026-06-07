import { generateTypes } from '../node_modules/payload/dist/bin/generateTypes.js'
import rawConfig from '../payload.config'

void (async () => {
  const config = await rawConfig
  await generateTypes(config)
  console.log('✓ payload-types.ts updated')
})()
