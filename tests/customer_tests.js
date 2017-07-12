const chai = require("chai");
const assert = chai.assert;
const supertest = require("supertest");
const app = require("../app")
const Item = require("../models/schema").Item;
const Machine = require('../models/schema').Machine

describe("/api/customer/items", function () {
  let item = false;
  afterEach(function(done){
    Item.deleteMany().then( function(){
      done()
    })
  })
  beforeEach(function(done){
    const i = new Item()
    i.description = 'chips'
    i.cost = 35
    i.quantity = 6
    i.save()
    .then(function (i){
      item = i;
      done();
    })
  })

  it("returns with a list of items in the vending machine", function (done) {
    supertest(app)
      .get("/api/customer/items")
      .expect(200)
      .expect("content-type", /json/)
      .end(done)
  })
})

describe("Customer can purchase items from the vending machine", function () {

  beforeEach (function (done) {
    const i = new Item()
    i.description = 'soda'
    i.cost = 85
    i.quantity = 10
    i.save()
    .then(function (i) {
      item = i;
      const machine = new Machine()
      machine.machineLog.push({quantity: 1})
    machine.save()
    .then(function(machine) {
      done();
    })
  })
  })

  it("allows customer to purchase item from the machine and will decrease the quantity by 1", function(done) {
    supertest(app)
    .post(`/api/customer/items/${item._id}/purchases`)
    .send({
      description: 'soda',
      cost: 85,
      quantity: 1
    })
    .expect(200)
    .expect(function(res) {
      console.log(res)
      assert.equal(res.body.totalAmount, 85)
      assert.equal(res.body.machineLog[1].quantity, 9)
    })
    .end(done)
  })
})
