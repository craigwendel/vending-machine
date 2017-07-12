const express = require('express');
const app = express();
const userRoutes = require('./routes/user')
const vendorRoutes = require('./routes/vendor')
const Machine = require("./models/schema").Machine;
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost:27017/vendingmachine');

app.use(bodyParser.json())

app.use(userRoutes)
app.use(vendorRoutes)

let machine = new Machine ()
machine.totalAmount = 0
machine.machineLog.push({description: 'chips', quantity: 6, purchaseTime: Date.now()})
machine.save()

app.listen(3000, function(){
  console.log("Vending Machine launched!")
})

module.exports = app;
