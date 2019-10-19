const configs = []


if (process.argv.includes(`--sandbox`)) configs.push(require('./webpack/sandbox'))
if (process.argv.includes(`--pptr`)) configs.push(require('./webpack/pptr'))

if (configs.length === 0) configs.push(require('./webpack/lib'))

module.exports = configs