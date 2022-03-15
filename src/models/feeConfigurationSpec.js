const mongoose = require('mongoose');

const FeeConfigurationSpecSchema = new mongoose.Schema({
    fee_id:  {
        type: String,
        required: true,
    },
    fee_currency:  {
        type: String,
        required: true,
    },
    fee_locale: {
        type: String,
        required: true,
    },
    fee_entity: {
        type: String,
        required: true,
    },
    entity_property:  {
        type: String,
        required: true
    },
    fee_type: {
      type: String,
      required: true,
    },
    fee_value: {
      type: String,
      required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
},{timestamps: true});

FeeConfigurationSpecSchema.method("toJSON", function () {
    const {__v, _id, ...object} = this.toObject();
    object.id = _id;
    delete object.deleted;
    return object;
});


const FeeConfigurationSpecModel = mongoose.model('FeeConfigurationSpec', FeeConfigurationSpecSchema);

module.exports =  FeeConfigurationSpecModel;