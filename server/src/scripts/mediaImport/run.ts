import glob from 'glob'

import { IMPORT_PATH } from '../../constants'

const run = async () => {
  const files = glob.sync(IMPORT_PATH + '/**/*')

  console.log('files', files)
}

export default run
