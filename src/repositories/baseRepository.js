class BaseRepository {

  model;

  async create(data)
  {
      return this.model.create(data);
  };

  /**
   *
   * @param data
   * @returns {Promise<*>}
   */
  async createMany(data)
  {
      return this.model.insertMany(data);
  }

  /**
   *
   * @param id
   * @returns {Promise<*>}
   */
  async getModelById(id)
  {
      return await this.model
          .findOne({_id: id})
          .exec();
  }

  /**
   *
   * @param filterObj
   * @returns {Promise<*>}
   */
  async getModelByCondition(filterObj)
  {
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
  async findLatest(conditions =  {},  fields =  {}){
      return await this.model
          .findOne(conditions, fields, { sort: { 'created_at' : -1 } })
          .exec()
  }

  /**
   *
   * @param paginationVal
   * @param pageVal
   * @param filterObj
   * @returns {Promise<*>}
   */
  async getCollection(filterObj = {})
  {
      return await this.model.find(filterObj)
          //.skip((pageVal - 1) * paginationVal)
          //.limit(paginationVal)
          .sort({createdAt: -1})
          .exec();
  }

  /**
   *
   * @param id
   * @param data
   * @param returnUpdatedData
   * @returns {Promise<Query<Document | null, Document>>}
   */
  async updateModel(id, data, returnUpdatedData = true)
  {
      return this.model.findByIdAndUpdate({_id: id}, data, {new: returnUpdatedData});
  }

  /**
   *
   * @param query
   * @param data
   * @param returnUpdatedData
   * @returns {Promise<Query<Document | null, Document>>}
   */
  async updateModelWithQuery(query, data, returnUpdatedData = true)
  {
      return this.model.findByIdAndUpdate(query, data, { new: returnUpdatedData });
  }

  /**
   * Delete a record
   * @param id
   * @returns {Promise<Query<Document | null, Document>>}
   */
  async deleteModel(id)
  {
      return this.model.findByIdAndDelete(id);
  };

  /**
   * Save a new admin record by passing a key-pair object
   * @returns {Promise<void>}
   */
  saveRecord = async (objBody) =>
  {
      /**
       * instantiate a new admin object
       */
      const record = new this.model(objBody);

      /**
       * save the record
       */
      await record.save();

      /**
       * Append the role model
       */
      return record;
  }

  /**
   * This updates a model record
   * @returns {Promise<void>}
   */
  updateRecord = async (model, queryObject, updateObject) =>
  {
      await model.updateOne(queryObject, {$set: updateObject}, (err, res) =>
      {
          if(err) return null;

          return res;
      });
  }


  /**
   * This is used to update any key:value of a given array of object
   * @param whereObject
   * @param arrayReference
   * @param object
   * @returns {Promise<void>}
   */
  updateArrayOfObjectsWhereExists = async (whereObject, arrayReference, object) =>
  {
      let updatedObj = {};

      /**
       * loop through the object to convert to key:value pair
       */
      for (let property in object)
      {
          const key = `${arrayReference}.$.${property}`;
          updatedObj = {...updatedObj, ...{[key]: object[property]}};
      }

      await this.model.updateOne(
          whereObject,
          {
              $set: updatedObj
          }
      );
  }

  /**
   * This sets the value of an array of object element back to array
   * @param whereObject
   * @param arrayReference
   * @returns {Promise<void>}
   */
  resetArrayOfObjects = async (whereObject, arrayReference) =>
  {
      await this.model.updateOne(
          whereObject,
          {
              $set: {
                  [arrayReference]: []
              }
          }
      );
  }

  /**
   * Retrieve an item from and array of items
   * @returns {*}
   */
  retrieveArrayItemFromArrayOfObjects = (arrayKey, indexKey, value) =>
  {
      const query = `${arrayKey}.$`;
      return this.model.findOne(
          {
              [arrayKey]: {
                  $elemMatch: { [indexKey]: value }
              }
          },
          {
              [query]: 1
          }
      ).then(res =>
      {
          return {
              base_id: res._id,
              data: res[arrayKey][0]
          };

      }).catch(error => { return null; })
  }

  /**
   * THis returns the total number of records present in an array of records
   * @param whereObject
   * @param arrayPointer
   * @returns {Promise<void>}
   */
  getTotalRecordsOfArrayOfObjects = async (whereObject, arrayPointer) =>
  {
      return this.model.findOne(whereObject)
          .then(res =>
              {
                  return res[arrayPointer].length;
              }
          ).catch(error => { return 0; });
  }

  /**
   *This adds an array of objects to existing array of objects
   * @param whereQueryObject
   * @param location
   * @param arrayOfObjects
   * @returns {Promise<void>}
   */
  addArrayOfObjectsToExistingArrayOfObjects = async (whereQueryObject, location, arrayOfObjects) =>
  {
      await this.model.updateOne(
          whereQueryObject,
          {
              $push: {
                  [location]: {
                      $each: arrayOfObjects
                  }
              }
          }
      );
  }

  /**
   * This is used to remove an object from an array of objects
   * @param whereQueryObject
   * @param arrayCursor //The array keyword
   * @param key
   * @param value
   * @returns {Promise<void>}
   */
  popObjectFromExistingArrayOfObject = async (whereQueryObject, arrayCursor, key, value) =>
  {
      await this.model.updateOne(
          whereQueryObject,
          {
              $pull: {
                  [arrayCursor]: {
                      [key]: value
                  }
              }
          }
      );
  }

  /**
   * This adds an object to already existing array
   * @param whereQueryObject
   * @param arrayKey
   * @param newObj
   * @returns {Promise<void>}
   */
  addObjectToExistingArrayOfObjects = async (whereQueryObject, arrayKey, newObj) =>
  {
      await this.model.updateOne(
          whereQueryObject,
          {
              $push: {
                  [arrayKey]: newObj
              }
          }
      );
  }

  /**
   * This adds an object to already existing array
   * @param whereQueryObject
   * @param insertArrayKey
   * @param insertArrayValue
   * @param updateArrayKey
   * @param updateArrayValue
   * @returns {Promise<void>}
   */
  addMultipleObjectToExistingArrayOfObjects = async ( whereQueryObject, insertArrayKey, insertArrayValue,
                                                      updateArrayKey, updateArrayValue ) =>
  {
      await this.model.updateOne(
          whereQueryObject,
          {
              $push: {
                  [insertArrayKey]: insertArrayValue
              },
              $set: {
                  [updateArrayKey]: updateArrayValue
              }
          }
      );
  }

  /**
   * This is used to capitalize all the first letters of a given string
   */
  capitalizeFirstLetters = (string) =>
  {
      let str = string.toLowerCase().split(' ');

      for(let i = 0; i < str.length; i++)
      {
          str[i] = str[i].charAt(0).toUpperCase() + str[i].substring(1);
      }

      return str.join(' ');
  }

}

module.exports = BaseRepository;
