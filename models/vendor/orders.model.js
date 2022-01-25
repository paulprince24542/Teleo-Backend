const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderList = new Schema({
  orderid: {
    type: String,
    required: true,
  },
  ordereduser: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  orderitems: [
    {
      type: Schema.Types.ObjectId,
      ref: "VendorProducts",
    },
  ],
  orderedconfirmation: {
    type: Boolean,
    default: false,
    required: true,
  },
});

module.exports = mongoose.model("OrderList", OrderList);
