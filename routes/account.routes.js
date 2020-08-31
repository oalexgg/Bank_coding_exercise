const express = require("express");
const accountController = require("./../controllers/account.controller");
const { body, param } = require("express-validator");

const api = express.Router();

api.get("/account/:id?", [param("id").isString()], accountController.listAccounts);
api.post(
  "/account",
  [
    body("nombre").isString(),
    body("descripcion").isString(),
    body("fecha_ingreso").isString(),
    body("ubicacion").isString(),
    body("cantidad").isInt(),
  ],
  accountController.saveAccount
);
api.put(
  "/account/:id",
  [
    param("id").isString(),
    body("nombre").isString(),
    body("descripcion").isString(),
    body("fecha_ingreso").isString(),
    body("ubicacion").isString(),
    body("cantidad").isInt(),
  ],
  accountController.updateAccount
);
api.delete(
  "/account/:id",
  [param("id").isString()],
  accountController.deleteAccount
);
module.exports = api;
