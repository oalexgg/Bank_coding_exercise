const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CustomerSchema = Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
  },
  accounts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },
  ],
  checking_balance: Number,
  savings_balance: Number,
});

CustomerSchema.pre("save", function (next) {
  this.wasNew = this.isNew;
  next();
});

CustomerSchema.post("save", async function (doc) {
  if (this.wasNew) {
    /**
     * Import is here because otherwise not it wouldn't detect the exported model.
     */
    const AccountModel = require("./account.model");
    const savings_account = new AccountModel({
        type: "Savings",
        customer: doc._id,
        balance: this.savings_balance,
      }),
      checking_account = new AccountModel({
        type: "Checking",
        customer: doc._id,
        balance: this.checking_balance,
      });
    doc.checking_balance = undefined;
    doc.savings_balance = undefined;
    try {
      await doc.save();
      await savings_account.save();
      await checking_account.save();
    } catch (error) {
      throw new Error(
        "Something failed when adding the account to the customer"
      );
    }
  }
});

module.exports = mongoose.model("Customer", CustomerSchema);
