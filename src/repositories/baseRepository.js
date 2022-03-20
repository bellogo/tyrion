class BaseRepository {
  constructor (model) {
    this.model = model;
  }

  async create (data) {
    return this.model.create(data);
  };

  /**
   *
   * @param data
   * @returns {Promise<*>}
   */
  async createMany (data) {
    return this.model.insertMany(data);
  }

  /**
   *
   * @param id
   * @returns {Promise<*>}
   */
  async getModelById (id) {
    return await this.model
      .findOne({ _id: id })
      .exec();
  }

  /**
   *
   * @param filterObj
   * @returns {Promise<*>}
   */
  async getModelByCondition (filterObj) {
    return await this.model
      .findOne(filterObj)
      .exec();
  }

  /**
   *
   * @param conditions
   * @param fields
   * @returns {Promise<*>}
   */
  async findLatest (conditions = {}, fields = {}) {
    return await this.model
      .findOne(conditions, fields, { sort: { created_at: -1 } })
      .exec()
  }

  /**
   *
   * @param id
   * @param data
   * @param returnUpdatedData
   * @returns {Promise<Query<Document | null, Document>>}
   */
  async updateModel (id, data, returnUpdatedData = true) {
    return this.model.findByIdAndUpdate({ _id: id }, data, { new: returnUpdatedData });
  }

  /**
   *
   * @param query
   * @param data
   * @param returnUpdatedData
   * @returns {Promise<Query<Document | null, Document>>}
   */
  async updateModelWithQuery (query, data, returnUpdatedData = true) {
    return this.model.findByIdAndUpdate(query, data, { new: returnUpdatedData });
  }

  /**
   * Delete a record
   * @param id
   * @returns {Promise<Query<Document | null, Document>>}
   */
  async deleteModel (id) {
    return this.model.findByIdAndDelete(id);
  };

  /**
   * Delete a record
   * @param id
   * @returns {Promise<Query<Document | null, Document>>}
   */
  async deleteAllModels () {
    return this.model.deleteMany({})
  };
}

module.exports = BaseRepository;
