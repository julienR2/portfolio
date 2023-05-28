import path from 'path'

export const IS_DEV = process.env.NODE_ENV !== 'production'

export const STORAGE_PATH = path.resolve('/home/julien/storage')
export const FILES_PATH = path.join(STORAGE_PATH, 'files')
export const MEDIA_PATH = path.join(STORAGE_PATH, 'media')
export const IMPORT_PATH = path.join(STORAGE_PATH, 'import')
export const UPLOADS_PATH = path.join(STORAGE_PATH, 'uploads')

export const DATA_PATH = path.join(process.cwd(), './data')
export const ARCHIVES_PATH = path.join(DATA_PATH, 'archives')

export const env = process.env
