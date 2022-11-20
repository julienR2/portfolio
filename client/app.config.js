const dotenv = require('dotenv')
const fs = require('fs')

const extra = dotenv.parse(fs.readFileSync('./.env'))

module.exports = {
  name: 'Nowmad Corner',
  slug: 'nowmad-corner',
  version: '1.0.0',
  sdkVersion: '47.0.0',
  platforms: ['ios', 'android', 'web'],
  android: {
    package: 'io.nowmad.corner',
  },
  ios: {
    bundleIdentifier: 'io.nowmad.corner',
  },
  extra,
}
