const configs = []


if (process.argv.includes('--sandbox')) configs.push(require('./webpack/sandbox'))

if (configs.length === 0) configs.push(require('./webpack/lib'))

module.exports = configs