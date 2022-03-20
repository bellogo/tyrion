const mongoose = require('mongoose');

const FeeConfigurationSpecSchema = new mongoose.Schema({
  fee_id: {
    type: String,
    required: true,
    unique: true
  },
  fee_currency: {
    type: String,
    required: true
  },
  fee_locale: {
    type: String,
    required: true,
    index: true
  },
  fee_entity: {
    type: String,
    required: true,
    index: true
  },
  entity_property: {
    type: String,
    index: true
  },
  fee_type: {
    type: String,
    required: true
  },
  fee_value: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const FeeConfigurationSpecModel = mongoose.model('FeeConfigurationSpec', FeeConfigurationSpecSchema);

module.exports = FeeConfigurationSpecModel;
