const express = require('express');
const router = express.Router();
const Item = require("../models/schema").Item;
const Machine = require('../models/schema').Machine

router.post('/api/vendor/items', function (req, res) {
  const item = new Item()
  item.description = req.body.description
  item.cost = req.body.cost
  item.quantity = req.body.quantity
  item.save()
  .then(function (item) {
    res.status(201).json(item)
  })
  .catch(function (error) {
    res.status(422).json(error)
  })
})

router.put('/api/vendor/items/:id', function (req, res) {
  Item.findOne({_id: req.params.id})
  .then(function (item) {
    item.description = req.body.description
    item.cost = req.body.cost
    item.quantity = req.body.quantity
    item.save()
    .then(function (item) {
      res.status(201).json(item)
    })
  })
})

router.get('/api/vendor/money', function (req, res) {
  Machine.find({}, {"totalAmount": 1})
  .then(function (amount) {
    res.status(200).json(amount)
  })
})

router.get('/api/vendor/purchases', function (req, res) {
  Machine.find({}, {"machineLog.description": 1, "machineLog.purchaseTime": 1})
  .then(function (purchases) {
    res.status(200).json(purchases)
  })
})

module.exports = router
