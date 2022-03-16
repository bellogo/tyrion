/**
 *
 */
require('../models/feeConfigurationSpec')
const mongoose = require('mongoose')
const BaseRepository = require('./baseRepository')

/**
  *
  */
class FeeConfigurationSpecRepository extends BaseRepository {
  constructor () {
    super()
    this.model = mongoose.model('FeeConfigurationSpec')
  }
}

/**
  * Export as a module
  */
module.exports = FeeConfigurationSpecRepository
