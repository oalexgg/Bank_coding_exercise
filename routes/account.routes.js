const express = require("express");
const accountController = require("./../controllers/account.controller");
const { body, param } = require("express-validator");

const api = express.Router();

api.get(
  "/account/:id?",
  [param("id").isString().optional()],
  accountController.listAccounts
);
api.post(
  "/account",
  [
    body("name").isString().exists(),
    body("type").isString().exists(),
    body("customer").isString().exists(),
  ],
  accountController.saveAccount
);
api.put(
  "/account/:id",
  [
    param("id").isString().exists(),
    body("name").isString().optional(),
    body("type").isString().optional(),
    body("reference").not().exists(),
    body("customer").not().exists(),
  ],
  accountController.updateAccount
);
api.delete(
  "/account/:id",
  [param("id").isString().exists()],
  accountController.deleteAccount
);
module.exports = api;
