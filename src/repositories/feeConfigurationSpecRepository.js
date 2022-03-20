require('../models/feeConfigurationSpec')
const mongoose = require('mongoose')
const BaseRepository = require('./baseRepository')

class FeeConfigurationSpecRepository extends BaseRepository {
  constructor () {
    super()
    this.model = mongoose.model('FeeConfigurationSpec')
  }

  /**
   *
   * @param filterObj
   * @returns {Promise<*>}
   */
  async getCollection (filterObj = {}) {
    return await this.model.find(filterObj)
      .sort({ fee_locale: -1, fee_entity: -1, entity_property: -1 })
      .exec();
  }
}

/**
  * Export as a module
  */
module.exports = FeeConfigurationSpecRepository
