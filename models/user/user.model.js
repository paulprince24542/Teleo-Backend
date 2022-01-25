const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  phonenumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  workrole: {
    type: String,
    required: true,
  },
  phoneVerified: {
    type: Boolean,
    default: false,
  },
  location: {
    type: { type: String, required: true },
    coordinates: [],
  },
  cart: [{ type: Schema.Types.ObjectId, ref: "VendorProducts" }],
  payments: [{ type: Schema.Types.ObjectId, ref: "Payment" }]
});

module.exports = mongoose.model("user", User);
