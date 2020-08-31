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
    body("nombre").isString(),
    body("descripcion").isString(),
    body("fecha_ingreso").isString(),
    body("ubicacion").isString(),
    body("cantidad").isInt(),
  ],
  customerController.saveCustomer
);
api.put(
  "/customer/:id",
  [
    param("id").isString(),
    body("nombre").isString(),
    body("descripcion").isString(),
    body("fecha_ingreso").isString(),
    body("ubicacion").isString(),
    body("cantidad").isInt(),
  ],
  customerController.updateCustomer
);
api.delete(
  "/customer/:id",
  [param("id").isString()],
  customerController.deleteCustomer
);
module.exports = api;
