const express = require("express");
const customerController = require("./../controllers/customer.controller");
const { body, param } = require("express-validator");

const api = express.Router();

api.get(
  "/customer/:id?",
  [param("id").isString()],
  customerController.listCustomers
);
api.post(
  "/customer",
  [
    body("first_name").isString().exists(),
    body("last_name").isString().exists(),
    body("phone").isNumeric().exists(),
    body("address").isString().exists(),
  ],
  customerController.saveCustomer
);
api.put(
  "/customer/:id",
  [
    param("id").isString(),
    body("first_name").isString(),
    body("last_name").isString(),
    body("phone").isNumeric(),
    body("address").isString(),
  ],
  customerController.updateCustomer
);
api.delete(
  "/customer/:id",
  [param("id").isString()],
  customerController.deleteCustomer
);
module.exports = api;
