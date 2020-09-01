const Customer = require("./../models/customer.model");
const { validationResult } = require("express-validator");

function listCustomers(req, res) {
  const id = req.params.id;
  let query;
  if (id) {
    query = Customer.findById(id);
  } else {
    query = Customer.find();
  }

  query.populate("accounts", "reference name type").exec((err, customer) => {
    if (err) {
      return res.status(500).send({
        message: "Something went wrong",
        err,
      });
    } else {
      if (
        (!Array.isArray(customer) && !customer) ||
        (Array.isArray(customer) && !customer.length)
      ) {
        res.status(404).send({
          message: "Sorry, we couldn't find any customers!",
        });
      } else {
        res.status(200).send({
          customer,
        });
      }
    }
  });
}

function saveCustomer(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).json({ errors: errors.array() });
  }
  var params = req.body;
  const { checking_balance, savings_balance } = req.body;
  console.log(params);
  var customer = new Customer({ ...params });
  
  customer.save((err, customerStored) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        message: "Something went wrong saving the customer",
        err,
      });
    } else {
      if (!customerStored) {
        res.status(400).send({
          message: "Something failed, the customer wasn't saved",
        });
      } else {
        res.status(200).send({
          customer: customerStored,
        });
      }
    }
  });
}

function updateCustomer(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).json({ errors: errors.array() });
  }
  const id = req.params.id;
  const update = req.body;
  Customer.findByIdAndUpdate(id, update, (err, customerUpdated) => {
    if (err) {
      return res.status(500).send({
        message: "Something went wrong updating the customer",
        err,
      });
    } else if (!customerUpdated) {
      return res.status(400).send({
        message: "Something failed, the customer wasn't updated",
      });
    }
    res.status(200).send({
      customer: customerUpdated,
    });
  });
}

function deleteCustomer(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).json({ errors: errors.array() });
  }
  var id = req.params.id;
  Customer.findByIdAndRemove(id, (err, customerRemoved) => {
    if (err) {
      return res.status(500).send({
        message: "Something went wrong deleting the customer",
        err,
      });
    } else if (!customerRemoved) {
      return res.status(500).send({
        message: "Something failed, the customer wasn't deleted",
      });
    }
    res.status(200).send({
      customer: customerRemoved,
    });
  });
}

module.exports = {
  listCustomers,
  saveCustomer,
  updateCustomer,
  deleteCustomer,
};
