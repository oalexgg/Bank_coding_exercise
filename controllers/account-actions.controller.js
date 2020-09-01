const Account = require("./../models/account.model");
const { validationResult } = require("express-validator");
var moment = require("moment");

function getAccountBalance(req, res) {
  const id = req.params.id;
  Account.findById(id, (err, account) => {
    if (err) {
      return res.status(500).send({
        message: "Something went wrong",
        err,
      });
    } else {
      if (!account) {
        res.status(404).send({
          message: "Sorry, we couldn't find any acconts!",
        });
      } else {
        res.status(200).send({
          balance: account.balance,
        });
      }
    }
  });
}

async function deposit(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).json({ errors: errors.array() });
  }
  const { quantity } = req.query,
    id = req.params.id,
    account = await Account.findById(id);
  if (!account) {
    return res.status(404).send({
      message: "Sorry, we couldn't find the accont!",
    });
  }
  account.balance += Number(quantity);
  try {
    await account.save();
  } catch (err) {
    return res.status(500).send({
      message: "An error occured while withdrawing, please retry later.",
      err,
    });
  }
  res.status(200).send({
    message: "Successfully deposited to this account.",
  });
}

async function withdrawal(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).json({ errors: errors.array() });
  }
  const { quantity } = req.query,
    id = req.params.id,
    account = await Account.findById(id);
  if (!account) {
    return res.status(404).send({
      message: "Sorry, we couldn't find the accont!",
    });
  }
  if (account.type === "Checking" && Number(quantity) > 500) {
    return res.status(422).send({
      message: "Checking account withdrawals are limited to $500.",
    });
  }
  if (account.balance < Number(quantity)) {
    return res.status(422).send({
      message:
        "The balance in this account is lower than the quantity required.",
    });
  }
  account.balance -= Number(quantity);
  try {
    await account.save();
  } catch (err) {
    return res.status(500).send({
      message: "An error occured while withdrawing, please retry later.",
      err,
    });
  }
  res.status(200).send({
    message: "Successfully withdrawed from this account.",
  });
}

async function transfer(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).json({ errors: errors.array() });
  }
  const { quantity } = req.query,
    { receiving_account_id } = req.body,
    transfer_amount = Number(quantity) + 1,
    id = req.params.id,
    sender_account = await Account.findById(id),
    receiving_account = await Account.findById(receiving_account_id);
  if (!sender_account) {
    return res.status(404).send({
      message: "Sorry, we couldn't find the sender accont!",
    });
  }
  if (!receiving_account) {
    return res.status(404).send({
      message: "Sorry, we couldn't find the receiving accont!",
    });
  }
  if (sender_account.balance < transfer_amount) {
    return res.status(422).send({
      message:
        "The balance in this account is lower than the quantity required.",
    });
  }
  sender_account.balance -= transfer_amount;
  receiving_account.balance += transfer_amount - 1;
  try {
    await sender_account.save();
    await receiving_account.save();
  } catch (err) {
    return res.status(500).send({
      message: "An error occured while transfering, please retry later.",
      err,
    });
  }
  res.status(200).send({
    message: "Successfully transfered from this account.",
  });
}

function calculateInterests(req, res) {
  const id = req.params.id;
  Account.findById(id, (err, account) => {
    if (err) {
      return res.status(500).send({
        message: "Something went wrong while trying to calculate interests.",
        err,
      });
    } else {
      if (!account) {
        res.status(404).send({
          message: "Sorry, we couldn't find any acconts!",
        });
      } else {
        if (account.type === "Checking") {
          return res.status(422).send({
            message: "Only saving accounts could generate interests.",
          });
        }
        if (account.balance <= 1000) {
          return res.status(422).send({
            message:
              "Only saving accounts with a balance greater than $1,000.00 could generate interests.",
          });
        }
        const months = moment().diff(moment(account.created_at), "months"),
          computed_interest =
            account.balance + months * (account.balance * 0.01);
        console.log(account.balance, months, account.balance * 0.01);
        res.status(200).send({
          computed_interest,
        });
      }
    }
  });
}

module.exports = {
  getAccountBalance,
  deposit,
  withdrawal,
  transfer,
  calculateInterests,
};
