const express = require('express');
const router = express.Router();
const Item = require("../models/schema").Item;
const Machine = require("../models/schema").Machine;

router.get('/api/customer/items', function (req, res) {
  Item.find()
  .then(function (item) {
    res.json(item)
  })
})

router.post('/api/customer/items/:id/purchases', function (req, res) {
  Item.findOne({_id: req.params.id})
  .then(function (item) {
    item.quantity -= req.body.quantity
    item.save()
      .then(function (item) {
        Machine.findOne()
        .then(function (machine) {
          machine.totalAmount = machine.totalAmount + (req.body.quantity * item.cost)
          machine.machineLog.push({description: item.description, quantity: item.quantity})
          machine.save()
          .then(function () {
            res.json(machine)
          })
        })
      })
  })
})

module.exports = router
