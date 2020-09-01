const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uuid = require("uuid");
const Customer = require("./customer.model");

const AccountSchema = Schema({
  reference: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    unique: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["Checking", "Savings"],
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
    required: true,
  },
  created_at: {
    type: Date,
    default: new Date(),
    required: true,
  },
});

AccountSchema.pre("save", function (next) {
  this.wasNew = this.isNew;
  if (this.isNew) {
    this.name = `${this.type.toLowerCase()}-${this.customer}`;
    this.reference = uuid.v4();
  }
  next();
});

AccountSchema.post("save", async function (doc) {
  if (this.wasNew) {
    try {
      await Customer.findByIdAndUpdate(doc.customer, {
        $push: { accounts: doc._id },
      });
    } catch (error) {
      throw new Error(
        "Something failed when adding the account to the customer"
      );
    }
  }
});

AccountSchema.pre("update", function (next) {
  if (this.isModified("customer") || this.isModified("reference")) {
    throw "This field cannot be modified!";
  } else {
    next();
  }
});

module.exports = mongoose.model("Account", AccountSchema);
