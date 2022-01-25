const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VendorProducts = new Schema({
  vendorId: { type: Schema.Types.ObjectId, ref: "user" },
  name: {
    type: String,
    required: true,
  },
  unit: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  subcategory: {
    type: String,
  },
  unitprice: {
    type: Number,
    required: true,
  },
  discountprice: {
    type: Number,
    required: true,
  },
  tax: {
    type: String,
    required: true,
  },
  imageurl: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("VendorProducts", VendorProducts);
