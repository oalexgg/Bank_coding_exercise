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
    body("savings_balance").isNumeric().optional(),
    body("checking_balance").isNumeric().optional(),
    body("last_name").isString().optional(),
  ],
  customerController.saveCustomer
);
api.put(
  "/customer/:id",
  [
    param("id").isString(),
    body("first_name").isString(),
    body("last_name").isString(),
  ],
  customerController.updateCustomer
);
api.delete(
  "/customer/:id",
  [param("id").isString()],
  customerController.deleteCustomer
);
module.exports = api;
