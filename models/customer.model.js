const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CustomerSchema = Schema({
  first_name: String,
  last_name: String,
  phone: Number,
  address: String,
  accounts:[ {
    type: Schema.Types.ObjectId,
    ref: "Account",
  }],
});

module.exports = mongoose.model("Customer", CustomerSchema);
