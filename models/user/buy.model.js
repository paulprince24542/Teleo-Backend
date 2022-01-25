const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Buy = new Schema({
  userid: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  paymentrequestid: {
    type: String,
    required: true,
  },
  paymentstatus: {
    type: Boolean,
    required: true,
    default: false,
  },
  productsbuying: [],
  deliveryaddress: {
    type: String,
    required: true,
  },
  totalamount: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("buy", Buy);
