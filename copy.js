const fs = require('fs-extra')

fs.copySync('./src/views', './_build/views')
fs.copySync('./src/public', './_build/public')
fs.copySync(
  './src/utils/apriori-obfuscated.js',
  './_build/utils/apriori-obfuscated.js'
)
