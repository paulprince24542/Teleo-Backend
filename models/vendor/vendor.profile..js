const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const profileSchema = new Schema({

  vendorId: { type: Schema.Types.ObjectId, ref: "user" },

  name: {
    type: String,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  //   gstnumber: {
  //     type: String,
  //   },
  //   profilepic: {
  //     imagename: {
  //       type: String,
  //     },
  //     tag: {
  //       type: String,
  //     },
  //     location: {
  //       type: String,
  //     },
  //   },
  //   regcertificate: {
  //     type: String,
  //   },
  //   alternatenumber: {
  //     type: Number,
  //   },
  //   email: {
  //     type: String,
  //   },
  //   storetype: {
  //     type: String,
  //   },
});

module.exports = mongoose.model(
  "vendorprofile",
  profileSchema,
  "vendorprofile"
);
