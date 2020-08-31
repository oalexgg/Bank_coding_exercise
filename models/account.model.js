const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uuid = require("uuid");

const AccountSchema = Schema({
  reference: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    unique: true,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
});

AccountSchema.pre("save", function (next) {
  this.reference = uuid.v4();
  next();
});

AccountSchema.pre("update", function (next) {
  if (this.isModified("customer") || this.isModified("reference")) {
    throw "This field cannot be modified!";
  } else {
    next();
  }
});

module.exports = mongoose.model("Account", AccountSchema);
