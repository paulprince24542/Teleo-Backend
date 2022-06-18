var Router = require("express").Router();
var jwt = require("jsonwebtoken");
var config = require("../../config/secretsConfig");
var { authenticateJWT } = require("../../middlewares/vendorJWT");
var {
  validateLogin,
  verifySign,
} = require("../../validation/vendor/vendor.validate");
//Otp Services
var {
  generateOtp,
  secretGenerator,
  validateOtp,
  sendOTP,
} = require("../../services/otp.service");
//Vendor Model
var Vendor = require("../../models/vendors");
const Roles = require("../../models/roles");

// @Route /api/vendor/login
// @Method POST

Router.post("/login", async (req, res) => {
  var error = validateLogin(req.body);
  if (error) {
    console.log(error);
    return res.status(400).json({
      error: error,
    });
  }
  var phone = req.body.phone;
  var presentVendor = await Vendor.findOne({
    where: {
      phone: phone,
    },
  });
  if (presentVendor == null) {
    var newVendor = await Vendor.create({
      phone,
    });
    var newVendorRoles = await Roles.create({
      role: "vendor",
      vendorId: newVendor.dataValues.id,
    });
    if (newVendorRoles.dataValues.id) {
      console.log("New Vendor Account");

      jwt.sign(
        {
          id: newVendor.dataValues.id,
          phone: newVendor.dataValues.phone,
          verified: newVendor.dataValues.is_verified,
        },
        config.jwtSecret,
        async function (err, token) {
          var data = await generateOtp();
          console.log("OTP: ", data.token);
          // sendOTP(newVendor.dataValues.phone,data.token,'vendor')
          res.status(200).json({
            account: "New User",
            msg: "Otp generated",
            otp: data.token,
            secret: data.secret,
            vtoken: token,
          });
        }
      );
    }
  } else {
    console.log("Vendor Account Found");
    var vendordata = presentVendor.dataValues;
    if (vendordata.id) var data = await generateOtp();
    jwt.sign(
      {
        id: presentVendor.dataValues.id,
        phone: presentVendor.dataValues.phone,
        verified: presentVendor.dataValues.is_verified,
      },
      config.jwtSecret,
      async function (err, token) {
        var data = await generateOtp();
        console.log("OTP: ", data.token);
        // sendOTP(newVendor.dataValues.phone,data.token,'vendor')
        res.status(200).json({
          account: "Found",
          msg: "Otp generated",
          otp: data.token,
          secret: data.secret,
          vtoken: token,
        });
      }
    );
  }
});

// @Route /api/vendor/verifylogin
// @Method POST

Router.post("/verifylogin", authenticateJWT, async (req, res) => {
  console.log(req.body);
  var error = verifySign(req.body);
  if (error) {
    console.log(error);
    return res.status(400).json({
      error: error,
    });
  }
  var verifyToken = await validateOtp(req.body.token, req.body.secret);
  console.log(verifyToken);
  if (verifyToken == true) {
    var foundVerified = await Vendor.findOne({
      where: {
        id: req.user.id,
      },
    });
    if (foundVerified.dataValues.is_verified == true) {
      res.status(200).json({
        data: "Otp Valid",
      });
    } else {
      Vendor.update(
        {
          is_verified: true,
        },
        {
          where: {
            id: req.user.id,
          },
        }
      );
      res.status(200).json({
        data: "Otp Valid",
        msg: "Vendor Verified",
      });
    }
  }
});

Router.post("/resendotp", authenticateJWT, async (req, res) => {
  try {
    var data = await generateOtp();
    if (data) {
      res.status(200).json({
        token: data.token,
        secret: data.secret,
      });
    } else {
      res.status(401).json({
        msg: "Token regeneration failed",
      });
    }
  } catch (err) {
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
});

Router.get("/test", (req, res) => {});

module.exports = Router;
