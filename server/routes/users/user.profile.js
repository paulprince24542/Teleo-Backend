var Router = require("express").Router();

const { response } = require("express");
var { authenticateJWTUser } = require("../../middlewares/userJWT");

var Profile = require("../../models/user-profile");
var Address = require("../../models/user-address");

Router.post("/profile", authenticateJWTUser, async (req, res) => {
  try {
    var findProfile = await Profile.findOne({
      where: {
        userId: req.user.id,
      },
    });
    if (findProfile == null) {
      var newProfile = await Profile.create({
        name: req.body.name,
        email: req.body.email,
        userId: req.user.id,
      });
      if (newProfile) {
        res.status(200).json({
          msg: "New Profile added",
        });
      }
    } else {
      var updateProfile = await Profile.update(
        {
          name: req.body.name,
          email: req.body.email,
        },
        {
          where: {
            userId: req.user.id,
          },
        }
      );
      if (updateProfile) {
        res.status(200).json({
          msg: "Profile Updated",
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      msg: "Internal Error",
    });
  }
});

// @Route /api/user/profile/address
Router.post("/profile/address", authenticateJWTUser, async (req, res) => {
  try {
    var countAddress = await Address.count({
      where: {
        userId: req.user.id,
      },
    });
    console.log(countAddress)
    if (countAddress < 3) {
      var newAddress = await Address.create({
        address: req.body.address,
        city: req.body.city,
        postalcode: req.body.postalcode,
        state: req.body.state,
        country: req.body.country,
        userId: req.user.id,
      });
      if (newAddress) {
        res.status(200).json({
          msg: "Address is added",
        });
      } else {
      }
    }else{
      res.status(400).json({
        msg: "Address limit reached"
      })
    }
  } catch (err) {
    console.log(err);
    res.status(401).json({
      msg: "Internal Server Error",
    });
  }
});

module.exports = Router;
