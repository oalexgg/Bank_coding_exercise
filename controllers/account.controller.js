const Account = require("./../models/account.model");
const { validationResult } = require("express-validator");

function listAccounts(req, res) {
  const id = req.params.id;
  let query;
  if (id) {
    query = Account.findById(id);
  } else {
    query = Account.find();
  }

  query
    .populate("customer", "first_name last_name phone address")
    .exec((err, account) => {
      if (err) {
        return res.status(500).send({
          message: "Something went wrong",
          err,
        });
      } else {
        if (
          (!Array.isArray(account) && !account) ||
          (Array.isArray(account) && !account.length)
        ) {
          res.status(404).send({
            message: "Sorry, we couldn't find any acconts!",
          });
        } else {
          res.status(200).send({
            account,
          });
        }
      }
    });
}

function saveAccount(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).json({ errors: errors.array() });
  }
  var params = req.body;
  var account = new Account({ ...params });

  account.save((err, accountStored) => {
    if (err) {
      console.error(err);
      return res.status(500).send({
        message: "Something went wrong saving the account",
        err,
      });
    } else {
      if (!accountStored) {
        res.status(400).send({
          message: "Something failed, the account wasn't saved",
        });
      } else {
        res.status(200).send({
          account: accountStored,
        });
      }
    }
  });
}

function updateAccount(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).json({ errors: errors.array() });
  }
  const id = req.params.id;
  const update = req.body;
  Account.findByIdAndUpdate(id, update, (err, accountUpdated) => {
    if (err) {
      return res.status(500).send({
        message: "Something went wrong updating the account",
        err,
      });
    } else if (!accountUpdated) {
      return res.status(400).send({
        message: "Something failed, the account wasn't updated",
      });
    }
    res.status(200).send({
      account: accountUpdated,
    });
  });
}

function deleteAccount(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).json({ errors: errors.array() });
  }
  var id = req.params.id;
  Account.findByIdAndRemove(id, (err, accountRemoved) => {
    if (err) {
      return res.status(500).send({
        message: "Something went wrong deleting the account",
        err,
      });
    } else if (!accountRemoved) {
      return res.status(500).send({
        message: "Something failed, the account wasn't deleted",
      });
    }
    res.status(200).send({
      account: accountRemoved,
    });
  });
}

module.exports = {
  listAccounts,
  saveAccount,
  updateAccount,
  deleteAccount,
};
