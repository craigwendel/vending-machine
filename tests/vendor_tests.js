const chai = require("chai");
const assert = chai.assert;
const supertest = require("supertest");
const app = require("../app")
const Item = require("../models/schema").Item
const Machine = require('../models/schema').Machine

describe("Vendor can put items in the machine and edit items in the machine", function () {
  beforeEach (function (done) {
    const i = new Item()
    i.description = 'chips'
    i.cost = 35
    i.quantity = 6
    i.save()
    .then(function (i) {
      item = i;
      done();
    })
  })
  it("allows the vendor to put new items into the vending machine", function (done) {
    supertest(app)
      .post('/api/vendor/items/')
      .send({
        description: 'soda',
        cost: 85,
        quantity: 10
      })
      .expect("content-type", /json/)
      .expect(201)
      .expect(function (res) {
        assert.equal(res.body.description, 'soda')
        assert.equal(res.body.cost, 85)
        assert.equal(res.body.quantity, 10)
      })
      .end(done)
  })

  it("allows the vendor to edit the quantity, cost, and item description in the vending machine", function (done) {
    newItemData = {
      cost: 60,
      description: 'corn chips',
      quantity: 10
    }
    supertest(app)
      .put(`/api/vendor/items/${item._id}`)
      .send(newItemData)
      .expect("content-type", /json/)
      .expect(201)
      .end(done)
  })
})

describe("Vendor requests from the vending machine", function () {
  let machine = false;
  afterEach(function(done){
    Machine.deleteMany().then( function(){
      done()
    })
  })
  beforeEach(function(done){
    const m = new Machine()
    m.totalAmount = 50
    m.machineLog.push({description: 'chips', quantity: 6, purchaseTime: Date.now()})
    m.save()
    .then(function (m){
    machine = m;
      done();
    })
  })

  it("returns with an amount that is in the vending machine", function (done) {
    supertest(app)
      .get("/api/vendor/money")
      .expect(200)
      .expect("content-type", /json/)
      .end(done)
  })

  it("returns with a list of all purchases with their time of purchase", function (done) {
    supertest(app)
      .get("/api/vendor/purchases")
      .expect(200)
      .expect("content-type", /json/)
      .end(done)
  })
})
