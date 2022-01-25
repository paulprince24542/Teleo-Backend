const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Payment = new Schema(
  {
    userid: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    paymenttime: {
      type: Date,
      default: Date.now,
    },
    paymenttype: {
      type: String,
      required: true,
    },
    paymentid: {
      type: String,
      required: true,
    },
    paymentrequestid: {
      type: String,
      required: true,
    },
  },
);

module.exports = mongoose.model("Payment", Payment);
