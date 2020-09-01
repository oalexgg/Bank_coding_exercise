const express = require("express");
const accountActionsController = require("./../controllers/account-actions.controller");
const { body, param, query } = require("express-validator");

const api = express.Router();
api.get(
  "/account/:id/balance",
  [param("id").isString().exists()],
  accountActionsController.getAccountBalance
);

api.post(
  "/account/:id/deposit",
  [query("quantity").isNumeric().exists()],
  accountActionsController.deposit
);

api.post(
  "/account/:id/withdrawal",
  [query("quantity").isNumeric().exists()],
  accountActionsController.withdrawal
);

api.post(
  "/account/:id/transfer",
  [
    query("quantity").isNumeric().exists(),
    body("receiving_account_id").isString().exists(),
  ],
  accountActionsController.transfer
);

api.get(
  "/account/:id/interest",
  [param("id").isString().exists()],
  accountActionsController.calculateInterests
);

module.exports = api;
