const fs = require('fs-extra')

fs.copySync('./.build', './build')
fs.copySync('./src/views', './build/views')
fs.copySync('./src/public/image', './build/public/image')

fs.mkdirSync('./build/public/upload')
