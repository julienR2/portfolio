import activobank from './activobank'
import bankin from './bankin'
import fileImport from './import'

export const SCRIPTS = {
  [activobank.id]: activobank,
  [bankin.id]: bankin,
  [fileImport.id]: fileImport,
}
