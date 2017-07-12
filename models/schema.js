const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

const machineSchema = new mongoose.Schema({
  totalAmount: {
    type: Number,
    default: 0
  },
  machineLog: [{
    description: {
      type: String
    },
    quantity: {
      type: Number
    },
    purchaseTime: {
      type: Date,
      default: Date.now
    }
  }]
})

const Item = mongoose.model('Item', itemSchema)
const Machine = mongoose.model('Machine', machineSchema)

module.exports = {
  Item: Item,
  Machine: Machine
}
