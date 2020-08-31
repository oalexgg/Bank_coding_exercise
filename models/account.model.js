const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AccountSchema = Schema({
  reference: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    unique: true,
  },
  type: String,
  customer: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
  },
});

module.exports = mongoose.model("Account", AccountSchema);
