var Router = require("express").Router();
var Profile = require("../../models/vendor-profile");
var { authenticateJWT } = require("../../middlewares/vendorJWT");

// @Route /api/vendor/startprofile
// @Method POST

Router.post("/startprofile", authenticateJWT, async (req, res) => {
  var startProfileFound = await Profile.findOne({
    where: {
      vendorId: req.user.id,
    },
  });
  if (startProfileFound == null) {
    var startProfile = await Profile.create({
      type: req.body.type,
      ownername: req.body.name,
      vendorId: req.user.id,
    });
    if (startProfile) {
      res.status(200).json({
        msg: "Start Profile Added",
      });
    }
  } else {
    res.status(400).json({
      msg: "Start Profile Already Present",
    });
  }
});

// @Route /api/vendor/profile
// @Method POST

Router.post("/profile", authenticateJWT, async (req, res) => {
  var profileFound = await Profile.findOne({
    where: {
      vendorId: req.user.id,
    },
  });
  if (profileFound == null) {
    var newProfile = await Profile.create({
      ownername: req.body.name,
      alternatephone: req.body.alterphone,
      email: req.body.email,
      address: req.body.address,
      city: req.body.city,
      postalcode: req.body.postalcode,
      state: req.body.state,
      country: req.body.country,
    });
  } else {
    var updatedProfile = await Profile.update(
      {
        ownername: req.body.name,
        alternatephone: req.body.alterphone,
        email: req.body.email,
        address: req.body.address,
        city: req.body.city,
        postalcode: req.body.postalcode,
        state: req.body.state,
        country: req.body.country,
      },
      {
        where: {
          vendorId: req.user.id,
        },
      }
    );
    console.log(updatedProfile);
    if (updatedProfile) {
      res.status(200).json({
        msg: "Profile Updated",
      });
    }
  }
});

Router.post("/profile/license", authenticateJWT, async (req, res) => {
  try {
    var updateLicense = await Profile.update(
      {
        gst: req.body.gst,
        fssai: req.body.fssai,
      },
      {
        where: {
          vendorId: req.user.id,
        },
      }
    );
    if (updateLicense) {
      res.status(200).json({
        msg: "License Added",
      });
    } else {
      res.status(400).json({
        msg: "Error in adding",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      msg: "Internal Error",
    });
  }
});

Router.post("/profile/image", authenticateJWT, (req, res) => {
    
});

module.exports = Router;
